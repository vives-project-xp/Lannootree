#pragma once

#include <fstream>
#include <cstdlib>
#include <signal.h>
#include <vector>

#include <lannootree_config.hpp>

#include <logger.hpp>
#include <led_buffer.hpp>
#include <unix_socket.hpp>
#include <led_driver_thread.hpp>

using json = nlohmann::json;

namespace Lannootree {

  /**
   * @brief The entrypoint of lannootree firmware,
   * starts automaticly upon creation.
   * 
   */
  class LannooTree {

    public:
      LannooTree();
      ~LannooTree();

    private:
      void start(void);

    private:
      static void socket_callback(void* arg, uint8_t* data, size_t data_len);

    private:
      void initialize_memory(json& config);
      ws2811_t* create_ws2811(json& config, int dma, int gpio1, int gpio2, std::string channel);

    private:
      json config;
      std::vector<ws2811_t*> _controllers;
      std::unordered_map<std::string, LedBuffer*> _channel_mem;

    private:
      volatile bool _running = true;

  };

}