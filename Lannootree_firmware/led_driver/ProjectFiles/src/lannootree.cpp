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

    info_log("Creating threads...");
    // Pass in thread object to thread starter, thread starter will delete heap memory
    ThreadStarter::add_thread("LedDriver", new LedDriverThread(config, _matrix_mapping, &_running));
    ThreadStarter::add_thread("Socket", new SocketThread(&_running, _matrix_mapping));

    std::unique_lock lock(mtx);
    shutdown_request.wait(lock);

    _running = false;

    info_log("Waiting for threads to join...");
    ThreadStarter::join_all();
    info_log("Lannootree gracefully shut down");
  }

}
