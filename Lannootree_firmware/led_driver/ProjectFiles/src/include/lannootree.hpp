#pragma once

#include <fstream>
#include <cstdlib>
#include <signal.h>

#include <matrix.hpp>
#include <unix_socket.hpp>
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

    private:
      static void martix_socket_callback(void* arg, uint8_t* data, size_t data_len);

    private:
      json config;
      Matrix < std::tuple<uint, uint32_t*> >* _matrix_mapping;

    private:
      volatile bool _running = true;

  };

}