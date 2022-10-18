#include <lannootree.hpp>

namespace { // Used for signal handeling
  std::mutex mtx;
  std::condition_variable shutdown_request;
}

namespace Lannootree {

  LannooTree::LannooTree() {
    start();
  }

  LannooTree::~LannooTree() {
    delete _matrix_mapping;
  }

  void LannooTree::start(void) {
    log(logo);
    info_log("Starting lannootree firmware");

    auto handel = [](int signum) {
      std::lock_guard lck(mtx);
      shutdown_request.notify_all();
    };

    signal(SIGINT, handel);
    signal(SIGTERM, handel);

    info_log("Reading config file...");
    std::ifstream f(JSON_FILE_PATH);
    config = json::parse(f);
    info_log("Cleaning up...");
    f.close();

    _matrix_mapping = new Matrix < std::tuple<uint, uint32_t*> > (config["dimentions"]["col"], config["dimentions"]["row"]);

    auto[width, height] = _matrix_mapping -> dimention();
    int max_read = (width * height) * 3;

    info_log("Creating threads...");
    // Pass in thread object to thread starter, thread starter will delete heap memory
    ThreadStarter::add_thread("LedDriver", new LedDriverThread(config, _matrix_mapping, &_running));
    ThreadStarter::add_thread("MatrixSocket", new SocketThread(&_running, max_read, martix_socket_callback, _matrix_mapping));

    std::unique_lock lock(mtx);
    shutdown_request.wait(lock);

    _running = false;

    info_log("Waiting for threads to join...");
    ThreadStarter::join_all();
    info_log("Lannootree gracefully shut down");
  }

  void LannooTree::martix_socket_callback(void* arg, uint8_t* data, size_t data_len) {
    auto _matrix = (Matrix< std::tuple<uint, uint32_t*> > *) arg;

    /**
     * @brief Values to skip
     * 
     * (1, 1) (1, 5) (1, 8)
     * (5, 1) (5, 5) (5, 8)
     * (8, 1) (8, 5) (8, 8)
     * 
     */

    auto[width, height] = _matrix -> dimention();
    for (int row = 0; row < height; row++) {
      for (int col = 0; col < width; col++) {
        int red_index = 3 * (width * row + col);
        int green_index = red_index + 1;
        int blue_index = green_index + 1;
        
        Color c(data[red_index], data[green_index], data[blue_index]);

        auto offset = std::get<0>(_matrix -> get_value(col, row));
        info_log("adding color to mem offset " << offset);
        auto memory = std::get<1>(_matrix->get_value(col, row));
        info_log("Memory: " << memory);

        uint32_t color = c.to_uint32_t();

        for (int i = 0; i < 72; i++) memory[offset + i] = color;
      }
    }
  }

}
