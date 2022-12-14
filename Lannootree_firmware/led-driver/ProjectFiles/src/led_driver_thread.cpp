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
    int ret = 0;

    std::string channel_a = "CA";
    std::string channel_b = "CB";

    while (_running) {
      // Render channel A Than Channel B
      auto controller_a = _controllers->at(0);

      _channel_mem->at("CA0")->mem_read(controller_a->channel[0].leds);
      _channel_mem->at("CA1")->mem_read(controller_a->channel[1].leds);

      ret = ws2811_render(controller_a, [](void* arg, void* channel) {

        auto _this = (LedDriverThread*) arg;
        _this->_channel_mem->at(*(std::string*) channel + "0")->swap();
        _this->_channel_mem->at(*(std::string*) channel + "1")->swap();

      }, this, &channel_a);

      if (ret != WS2811_SUCCESS) {
        std::string error = ws2811_get_return_t_str((ws2811_return_t)ret);
        error_log("Failed to render " << error);
      }


      auto controller_b = _controllers->at(1);

      _channel_mem->at("CB0")->mem_read(controller_b->channel[0].leds);
      _channel_mem->at("CB1")->mem_read(controller_b->channel[1].leds);

      ret = ws2811_render(controller_a, [](void* arg, void* channel) {

        auto _this = (LedDriverThread*) arg;
        _this->_channel_mem->at(*(std::string*) channel + "0")->swap();
        _this->_channel_mem->at(*(std::string*) channel + "1")->swap();

      }, this, &channel_b);

      if (ret != WS2811_SUCCESS) {
        std::string error = ws2811_get_return_t_str((ws2811_return_t)ret);
        error_log("Failed to render " << error);
      }
    }
  }

}
