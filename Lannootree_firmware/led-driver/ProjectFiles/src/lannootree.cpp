#include <lannootree.hpp>
#include <logger.hpp>

#include <chrono>

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

    UnixSocket lannootree_socket("./dev/lannootree.socket", 288 * 3, socket_callback, &_channel_mem);
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
    bool ca0 = false;
    bool ca1 = false;
    bool cb0 = false;
    bool cb1 = false;

    for (std::string c : config["inUseChannels"]) {
      if (c.compare("CA0") == 0)
        ca0 = true;
      if (c.compare("CA1") == 0)
        ca1 = true;
      if (c.compare("CB0") == 0)
        cb0 = true;
      if (c.compare("CB1") == 0)
        cb1 = true;
    };

    if ((ca0 || ca1) && (cb0 || cb1)) {
      throw "Multiple channels are no implemented!";
      // Creation of led controll blocks
      _controllers.push_back(create_ws2811(config, 10, 18, 19, "CA"));
      _controllers.push_back(create_ws2811(config, 11, 9, 10, "CB"));

      // Creation of led buffers
      if (_controllers.at(0)->channel[0].count)
        _channel_mem["CA0"] = new LedBuffer(_controllers.at(0)->channel[0].count);

      if (_controllers.at(0)->channel[1].count)
        _channel_mem["CA1"] = new LedBuffer(_controllers.at(0)->channel[1].count);

      if (_controllers.at(1)->channel[0].count)
        _channel_mem["CB0"] = new LedBuffer(_controllers.at(1)->channel[0].count);

      if (_controllers.at(1)->channel[1].count)
        _channel_mem["CB1"] = new LedBuffer(_controllers.at(1)->channel[1].count);

    }
    else {
      bool isChannelA = (ca0 || ca1);
      // Creation of led control block
      _controllers.push_back(create_ws2811(config, 10, 18, 19, isChannelA ? "CA" : "CB"));

      info_log((isChannelA ? "Using channel A" : "Not using channel A") << "\n");

      // Creation of led buffers
      if (_controllers.at(0)->channel[0].count > 0)
        _channel_mem[isChannelA ? "CA0" : "CB0"] = new LedBuffer(_controllers.at(0)->channel[0].count);

      info_log("ChanA0 led count: " << _controllers.at(0)->channel[0].count << "\n");

      if (_controllers.at(0)->channel[1].count > 0)
        _channel_mem[isChannelA ? "CA1" : "CB1"] = new LedBuffer(_controllers.at(0)->channel[1].count);
        
    }

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

    std::vector<uint32_t> colors;
    for (int i = 0; i < 288; i++) {
      color c;
      c.data[0] = data[(3 * i) + 2]; // blue
      c.data[1] = data[(3 * i) + 1];  // green
      c.data[2] = data[(3 * i) + 0]; // Red
      c.data[3] = 0; // White

      colors.push_back(c.wrgb);
    }

    _channel_mem->at("CA0")->mem_write(colors.data(), colors.size() * sizeof(uint32_t));
  }

}
