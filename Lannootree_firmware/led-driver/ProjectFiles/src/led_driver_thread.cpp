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

    std::for_each(_channel_mem->begin(), _channel_mem->end(), [](std::pair<std::string, LedBuffer *> key_value) {
      auto [chan, buff] = key_value;
      std::cout << "Shutting down " << chan << std::endl;
      buff->shutdown();
    });

    std::cout << "joining thread" << std::endl;
    _t.join();
  }

  void LedDriverThread::loop(void) {
    int ret;

    while (_running) {

      for (auto c : *_controllers) {

        bool success = _channel_mem->at("CA0")->mem_read(c->channel[0].leds);

        if (!success) break;

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
