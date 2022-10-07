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
      LannooTree(std::ifstream& f);
      ~LannooTree();

    public:
      void start(void);
      void stop(void) { _running = false; };

    private:
      json config;
      Queue<Color> _color_queue;
      
    private:
      LedDriverThread led_task;
      SocketThread socket_task;

    private:
      bool _running = true;

  };

}