#include <ledstrip_controller.hpp>

namespace Lannootree {

  #define CA  0b00000001
  #define CA0 0b00000011
  #define CA1 0b00000101
  #define CB  0b00010000
  #define CB0 0b00110000
  #define CB1 0b01010000

  void LedstripController::init_ws2811(ws2811_t* ws, json& config, int dma, int gpio0, int gpio1, std::string chan) {
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

  LedstripController::LedstripController(json config) {
    for (std::string c : config["inUseChannels"]) {
      if (c.compare("CA0") == 0) _channels |= CA0;
      if (c.compare("CA1") == 0) _channels |= CA1;
      if (c.compare("CB0") == 0) _channels |= CB0;
      if (c.compare("CB1") == 0) _channels |= CB1;
    };

    info_log(((_channels & CA0) ? "CA0 in use" : "CA0 not in use"));
    info_log(((_channels & CA1) ? "CA1 in use" : "CA1 not in use"));
    info_log(((_channels & CB0) ? "CB0 in use" : "CB0 not in use"));
    info_log(((_channels & CB1) ? "CB1 in use" : "CB1 not in use"));

    if (_channels & CA & CB) {
      // Both channels are in use
      _controllers.push_back(new ws2811_t);
      _controllers.push_back(new ws2811_t);

      init_ws2811(_controllers.at(0), config, 10, 18, 19, "CA");
      init_ws2811(_controllers.at(1), config, 11, 0, 0, "CB");
    } else {
      _controllers.push_back(new ws2811_t);
      init_ws2811(_controllers.at(0), config, 10, 18, 19, (_channels & CA) ? "CA" : "CB");
    }

    for (auto c : _controllers) {
      if (ws2811_init(c) != WS2811_SUCCESS) {
        error_log("Failed to init ws2811");
        _all_success = false;
      } 
    }

  }

  LedstripController::~LedstripController() {
    if (_controllers.size() > 0) {
      for (auto c : _controllers) {
        if (_all_success) ws2811_fini(c);
        delete c;
      }
    }
  }

  void LedstripController::update(void) {
    
  }

}
