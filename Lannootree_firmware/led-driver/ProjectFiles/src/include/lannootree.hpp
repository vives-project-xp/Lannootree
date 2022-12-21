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
    /**
     * Initializes the hardware resources and starts the threads for the
     * LED driver and Unix socket.
     */
      void start(void);

    private:
      static void socket_callback(void* arg, uint8_t* data, size_t data_len);

    private:
    /**
     * Initializes memory by creating LED controllers and LED buffers based
     * on the provided configuration data.
     * 
     * @param config A JSON object containing configuration data.
     */
      void initialize_memory(json& config);
    
    /**
     * Creates an LED controller object based on the provided parameters
     * and configuration data.
     * 
     * @param config A JSON object containing configuration data.
     * @param gpio1 & gpio0 The GPIO pin number to use for the LED controller.
     * @param mda The DMA controller to use for the LED controller.
     * @param channel The prefix for the channels (e.g. "CA" or "CB").
     * @return A pointer to the newly created LED controller object.
     */
      ws2811_t* create_ws2811(json& config, int dma, int gpio1, int gpio2, std::string channel);

    private:
      json config;
      std::vector<ws2811_t*> _controllers;
      std::unordered_map<std::string, LedBuffer*> _channel_mem;

    private:
      volatile bool _running = true;

  };

}
