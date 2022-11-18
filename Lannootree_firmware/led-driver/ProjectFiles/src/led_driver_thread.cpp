#include <led_driver_thread.hpp>

namespace Lannootree {

  LedDriverThread::LedDriverThread(std::unordered_map<std::string, LedBuffer*>* channel_mem, std::vector<ws2811_t*>* controllers) 
  : _channel_mem(channel_mem), _controllers(controllers) { }

  LedDriverThread::~LedDriverThread() {}

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

      for (auto c : *_controllers) {

        _channel_mem->at("CA0")->mem_read(c->channel[0].leds);

        ret = ws2811_render(c, 
          [](void* arg){ 
            auto driver = (LedDriverThread*) arg;
            driver->_channel_mem->at("CA0")->swap(); 
          }, this);

        if (ret != WS2811_SUCCESS) {
          std::string error = ws2811_get_return_t_str((ws2811_return_t)ret);
          error_log("Failed to render " << error);
        }
      }
    }
  }

}
