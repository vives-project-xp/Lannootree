#include <led_driver_thread.hpp>

namespace Lannootree {

  LedDriverThread::LedDriverThread(json& config, Queue<Color>* queue) : queue(queue) {
    bool ca0, ca1, cb0, cb1 = false;

    for (std::string c : config["inUseChannels"]) {
      if (c.compare("CA0") == 0) ca0 = true;
      if (c.compare("CA1") == 0) ca1 = true;
      if (c.compare("CB0") == 0) cb0 = true;
      if (c.compare("CB1") == 0) cb1 = true;
    };

    for (auto c : _controllers) {
      if (ws2811_init(c) != WS2811_SUCCESS) {
        error_log("Failed to init ws2811");
      } 
    }
  }

  LedDriverThread::~LedDriverThread() {
    if (_controllers.size() > 0) {
      for (auto c : _controllers) {
        ws2811_fini(c);
        delete c;
      }
    }
  }

  void LedDriverThread::loop(void) {
    Color c;
    
    while (true) {
      if (!queue->pop(c)) break;

      info_log("Received color 0x00" << std::hex << c.to_uint32_t());
    }
  }

  void LedDriverThread::init_ws2811(ws2811_t* ws, json& config, int dma, int gpio0, int gpio1, std::string chan) {
    ws->freq = WS2811_TARGET_FREQ;
    ws->dmanum = dma;
    ws->channel[0] = {
      .gpionum = gpio0,
      .invert  = 0,
      .count   = config["channels"][chan + '0']["ledCount"],
      .strip_type = STRIP_TYPE,
      .brightness = 255,
    };
    ws->channel[1] = {
      .gpionum = gpio1,
      .invert  = 0,
      .count   = config["channels"][chan + '1']["ledCount"],
      .strip_type = STRIP_TYPE,
      .brightness = 255,
    };
  }

}
