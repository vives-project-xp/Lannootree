#pragma once

#include <fstream>
#include <cstdlib>
#include <socket_thread.hpp>
#include <thread_starter.hpp>
#include <lannootree_config.hpp>
#include <led_driver_thread.hpp>

using json = nlohmann::json;

namespace Lannootree {

  class LannooTree {

    public:
      LannooTree();
      ~LannooTree();

    public:
      void start(void);
      void stop(void) { _running = false; };

    private:
      json config;
      Queue<Color> _color_queue;

    private:
      bool _running;
      std::condition_variable signal_received;

  };

}