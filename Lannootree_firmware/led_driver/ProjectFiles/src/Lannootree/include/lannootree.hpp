#pragma once

#include <fstream>

#include <json.hpp>
#include <queue.hpp>
#include <color.hpp>
#include <thread_starter.hpp>
#include <lannootree_config.hpp>
#include <ledstrip_controller.hpp>

using json = nlohmann::json;

namespace Lannootree {

  class LannooTree {

    public:
      static LannooTree& get(void) {
        static LannooTree instance;
        return instance;
      }

    public:
      static void start(void);

    private:
      LannooTree(void) {
        add_sig_handlers();
      };

      ~LannooTree() {};

    private:
      void add_sig_handlers(void);

    private:
      json config;
      Queue<Color> _color_queue;
      
    private:
      std::shared_ptr<LedstripController> controller;

    public:
      LannooTree(LannooTree const&)     = delete;
      void operator=(LannooTree const&) = delete;

  };

}