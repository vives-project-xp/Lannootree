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

      for (auto& [channel, led_buffer] : *_channel_mem) {
        ws2811_t* controller = _controllers->at(channel.substr(0, 1) == "CA" ? 0 : 1);
        
        bool success = led_buffer->mem_read(controller->channel[channel.substr(1, 2) == "0" ? 0 : 1].leds);

        if (!success) break;
        
        // Because ws2811 driver is writen in C this mess exists
        ret = ws2811_render(controller, [](void* arg, void* channel) {
          
          auto _this = (LedDriverThread*) arg;
          _this->_channel_mem->at(*(std::string*) channel)->swap();

        }, this, (void*) &channel);

        if (ret != WS2811_SUCCESS) {
          std::string error = ws2811_get_return_t_str((ws2811_return_t)ret);
          error_log("Failed to render " << error);
        }
      }
    }
  }

}
