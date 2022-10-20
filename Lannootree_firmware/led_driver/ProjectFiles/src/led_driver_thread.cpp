#include <led_driver_thread.hpp>

namespace Lannootree {

  LedDriverThread::LedDriverThread(json &config, Matrix<std::tuple<uint, uint32_t *>> *matrix) : _matrix(matrix) {
    initialize_memory(config);

    std::for_each(config["channels"].begin(), config["channels"].end(), [&](const json &channel) {
      std::string head_id = channel["head"];

      // Lambda to find cell with uuid
      auto find_cell = [ & ](std::string uuid) {
        for (auto & cell: channel["cells"]) {
          if (cell["uuid"] == uuid) return cell;
        }
        return json::parse(""); //! Should not happen 
      };

      int offset = 0;
      auto current = find_cell(head_id);
      while (true) {
        auto coordinate = current["coordinate"];

        info_log("Adding panel");
        info_log("Col: " << coordinate["col"] << " Row: " << coordinate["row"]);

        auto& [t_offset, t_mem] = _matrix->get_value((int) coordinate["col"], (int) coordinate["row"]);

        t_offset = offset + PANEL_LED_COUNT;
        t_mem = _channel_mem[channel["channel"]];
        // std::get<0>(_matrix->get_value((int) coordinate["col"] - 1, (int) coordinate["row"] - 1)) = (uint)(offset * PANEL_LED_COUNT);
        // std::get<1>(_matrix->get_value((int) coordinate["col"] - 1, (int) coordinate["row"] - 1)) = (uint32_t*)(_channel_mem.at(current["channel"]));


        info_log(current["channel"] << " Memory address: " << _channel_mem.at(current["channel"]));
        info_log("Offset in matrix: " << std::get<0>(_matrix->get_value((int) coordinate["col"] - 1, (int) coordinate["row"] - 1)));
        info_log("Memory in matrix: " << std::get<1>(_matrix->get_value((int) coordinate["col"] - 1, (int) coordinate["row"] - 1)));

        if (!current.contains("connection")) break;

        current = find_cell(current["connection"]);
        offset++;
      }; 
    });
  }

  LedDriverThread::~LedDriverThread() {
    if (_controllers.size() > 0) {
      for (auto c : _controllers) {
        ws2811_fini(c);
        delete c;
      }
    }

    for (auto [name, mem] : _channel_mem) {
      delete[] mem;
    }
  }

  void LedDriverThread::start(void) {
    _running = true;
    _t = std::thread(&LedDriverThread::loop, this);
  }

  void LedDriverThread::stop(void) {
    _running = false;
    _t.join();
  }

  void LedDriverThread::loop(void) {
    int ret;

    while (_running) {
      for (auto controller : _controllers) {
        for (int i = 0; i < (72 * 4); i++) {
          controller->channel[0].leds[i] = _channel_mem.at("CA0")[i];
        }
        
        if ((ret = ws2811_render(controller, [](void* arg){}, this)) != WS2811_SUCCESS) {
          std::string error = ws2811_get_return_t_str((ws2811_return_t)ret);
          error_log("Failed to render " << error);
        }

        std::this_thread::sleep_for(std::chrono::milliseconds(4));
      }      
    }
  }

  void LedDriverThread::initialize_memory(json &config) {
    bool ca0, ca1, cb0, cb1 = false;

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
      // Creation of led controll blocks
      _controllers.push_back(create_ws2811(config, 10, 18, 19, "CA"));
      _controllers.push_back(create_ws2811(config, 11, 9, 10, "CB"));

      // Creation of led buffers
      if (_controllers.at(0)->channel[0].count)
        _channel_mem["CA0"] = new uint32_t[_controllers.at(0)->channel[0].count]();

      if (_controllers.at(0)->channel[1].count)
        _channel_mem["CA1"] = new uint32_t[_controllers.at(0)->channel[1].count]();

      if (_controllers.at(1)->channel[0].count)
        _channel_mem["CB0"] = new uint32_t[_controllers.at(1)->channel[0].count]();

      if (_controllers.at(1)->channel[1].count)
        _channel_mem["CB1"] = new uint32_t[_controllers.at(1)->channel[1].count]();
    }
    else {
      bool isChannelA = (ca0 || ca1);
      // Creation of led control block
      _controllers.push_back(create_ws2811(config, 10, 18, 19, isChannelA ? "CA" : "CB"));

      info_log((isChannelA ? "Using channel A" : "Not using channel A"));

      // Creation of led buffers
      if (_controllers.at(0)->channel[0].count > 0)
      {
        info_log("Created memory");
        info_log("GPIO: " << _controllers.at(0)->channel[0].gpionum);
        _channel_mem[isChannelA ? "CA0" : "CB0"] = new uint32_t[_controllers.at(0)->channel[0].count]();
      }

      if (_controllers.at(0)->channel[1].count > 0)
        _channel_mem[isChannelA ? "CA1" : "CB1"] = new uint32_t[_controllers.at(0)->channel[1].count]();
    }

    // Initialize led control blocks
    for (auto c : _controllers) {
      if (ws2811_init(c) != WS2811_SUCCESS) {
        error_log("Failed to init ws2811");
      }
    }
  }

  ws2811_t *LedDriverThread::create_ws2811(json &config, int dma, int gpio1, int gpio2, std::string channel) {
    auto instance = new ws2811_t;
    instance->freq = WS2811_TARGET_FREQ;
    instance->dmanum = dma;
    instance->render_wait_time = 10;
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

}
