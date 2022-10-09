#pragma once

#include <fstream>
#include <cstdlib>
#include <signal.h>
#include <socket_thread.hpp>
#include <thread_starter.hpp>
#include <lannootree_config.hpp>
#include <led_driver_thread.hpp>

using json = nlohmann::json;

namespace {
  std::mutex mtx;
  std::condition_variable shutdown_request;
}

namespace Lannootree {

  class LannooTree {

    public:
      LannooTree();
      ~LannooTree();

    public:
      void start(void);

    private:
      json config;
      Queue<Color> _color_queue;

    private:
      bool _running = true;

  };

}