#include <lannootree.hpp>
#include <logger.hpp>

#include <chrono>
#include <future>

namespace { // Used for signal handeling
  std::mutex mtx;
  std::condition_variable shutdown_request;
}

namespace Lannootree {

  LannooTree::LannooTree() {
    start();
  }

  LannooTree::~LannooTree() {
    for (auto c : _controllers) delete c;
    for (auto [chan, mem] : _channel_mem) delete mem;
  }

  void LannooTree::start(void) {
    log(logo);
    info_log("Starting lannootree firmware\n");

    auto handel = [](int signum) {
      std::cout << "signal received: " << signum << std::endl;
      std::lock_guard lck(mtx);
      shutdown_request.notify_all();
    };

    signal(SIGINT, handel);
    signal(SIGTERM, handel);
    signal(SIGKILL, handel);

    info_log("Reading config file...\n");
    std::ifstream f(JSON_FILE_PATH);
    config = json::parse(f);
    info_log("Cleaning up...\n");
    f.close();

    initialize_memory(config);

    LedDriverThread led_driver(&_channel_mem, &_controllers);
    led_driver.start();

    UnixSocket lannootree_socket("./dev/lannootree.socket", 864 * 3, socket_callback, &_channel_mem); //288*3
    lannootree_socket.start();

    // Wait for shutdown signal
    std::unique_lock lock(mtx);
    shutdown_request.wait(lock);

    info_log("Waiting for threads to join...\n");
    led_driver.stop();
    lannootree_socket.stop();

    info_log("Lannootree gracefully shut down\n");
  }

  void LannooTree::initialize_memory(json &config) {
    std::cout << "Init memory" << std::endl;
    // Create ws2811 controllers for both channels
    _controllers.push_back(create_ws2811(config, 10, 18, 19, "CA"));
    // _controllers.push_back(create_ws2811(config, 11, 12, 13, "CB"));

    // Allocate a new buffer for each channel
    _channel_mem["CA0"] = new LedBuffer(_controllers.at(0)->channel[0].count);
    _channel_mem["CA1"] = new LedBuffer(_controllers.at(0)->channel[1].count);
    // _channel_mem["CB0"] = new LedBuffer(_controllers.at(1)->channel[0].count);
    // _channel_mem["CB1"] = new LedBuffer(_controllers.at(1)->channel[1].count);

    // Initialize led control blocks
    for (auto c : _controllers) {
      if (ws2811_init(c) != WS2811_SUCCESS) {
        error_log("Failed to init ws2811\n");
      }
    }
  }

  ws2811_t* LannooTree::create_ws2811(json &config, int dma, int gpio1, int gpio2, std::string channel) {
    auto instance = new ws2811_t;
    instance->freq = WS2811_TARGET_FREQ;
    instance->dmanum = dma;
    instance->render_wait_time = 100;
    instance->channel[0] = {
        .gpionum = gpio1,
        .invert = 0,
        .count = config["channels"].contains(channel + "0") ? (int)config["channels"][channel + "0"]["ledCount"] : 0,
        .strip_type = STRIP_TYPE,
        .brightness = 255,
    };
    instance->channel[1] = {
        .gpionum = gpio2,
        .invert = 0,
        .count = config["channels"].contains(channel + "1") ? (int)config["channels"][channel + "1"]["ledCount"] : 0,
        .strip_type = STRIP_TYPE,
        .brightness = 255,
    };

    return instance;
  }

  void LannooTree::socket_callback(void* arg, uint8_t* data, size_t data_len) {
    auto _channel_mem = (std::unordered_map<std::string, LedBuffer*>*) arg;

    // This can be a constant buffer
    std::vector<uint32_t> colorsa0;
    for (int i = 0; i < 864; i++) {
      Color c;
      c.data[0] = data[(3 * i) + 2];  // blue
      c.data[1] = data[(3 * i) + 1];  // green
      c.data[2] = data[(3 * i) + 0];  // Red
      c.data[3] = 0; // White

      colorsa0.push_back(c.wrgb);
    }

    // std::vector<uint32_t> colorsa1;
    // for (int i = 144; i < 288; i++) {
    //   Color c;
    //   c.data[0] = data[(3 * i) + 2];  // blue
    //   c.data[1] = data[(3 * i) + 1];  // green
    //   c.data[2] = data[(3 * i) + 0];  // Red
    //   c.data[3] = 0; // White

    //   colorsa1.push_back(c.wrgb);
    // }

    // std::vector<uint32_t> colorsb0;
    // std::vector<uint32_t> colorsb1;


    auto channelA0 = std::async(std::launch::async, [&]() {
      _channel_mem->at("CA0")->mem_write(colorsa0.data(), colorsa0.size() * sizeof(uint32_t));
    });

    // auto channelA1 = std::async(std::launch::async, [&]() {
    //   _channel_mem->at("CA1")->mem_write(colorsa1.data(), colorsa1.size() * sizeof(uint32_t));
    // });

    // auto channelB0 = std::async(std::launch::async, [&]() {
    //   _channel_mem->at("CB0")->mem_write(colorsb0.data(), colorsb0.size() * sizeof(uint32_t));
    // });

    // auto channelB1 = std::async(std::launch::async, [&]() {
    //   _channel_mem->at("CB1")->mem_write(colorsb1.data(), colorsb1.size() * sizeof(uint32_t));
    // });

    channelA0.wait();
    // channelA1.wait();
    // channelB0.wait();
    // channelB1.wait();
  }

}
