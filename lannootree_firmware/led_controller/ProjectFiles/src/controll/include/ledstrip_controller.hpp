#pragma once

#include <string>
#include <ws2811.h>
#include <json.hpp>

#include <lannootree_config.hpp>

using json = nlohmann::json;

namespace Lannootree {

  class LedstripController {

    public:
      LedstripController(json config);
      ~LedstripController();

    public:
      void update(void);

    private:
      void init_ws2811(ws2811_t* ws, json& config, int dma, int gpio0, int gpio1, std::string chan);

    private:
      bool _all_success = true;
      uint8_t _channels = 0;
      std::vector<ws2811_t*> _controllers;

  };

}
