#pragma once

#include <matrix.hpp>
#include <led_buffer.hpp>
#include <lannootree_config.hpp>

using json = nlohmann::json;

namespace Lannootree {
  
  class LedDriverThread {

    public:
      LedDriverThread(std::unordered_map<std::string, LedBuffer*>* channel_mem, std::vector<ws2811_t*>* controllers);
      ~LedDriverThread();

    public:
      void start(void);
      void stop(void);

    private:
      void loop(void);

    private:
      bool _running = false;
      std::thread _t;

    private:
      std::vector<ws2811_t*>* _controllers;
      std::unordered_map<std::string, LedBuffer*>* _channel_mem;

    public:
      /** @brief LedDriverThread is not copyable */
      LedDriverThread(const LedDriverThread&) = delete;

      /** @brief LedDriverThread is not copyable */
      LedDriverThread& operator=(const LedDriverThread&) = delete;

      /** @brief LedDriverThread is movable */
      LedDriverThread(LedDriverThread&& other) noexcept {
        *this = std::move(other);
      };

      /** @brief LedDriverThread is movable */
      LedDriverThread& operator=(LedDriverThread&& other) {
        _t = std::move(other._t);
        _running = other._running;
        _controllers = other._controllers;
        _channel_mem = other._channel_mem;

        other._channel_mem = nullptr;
        other._controllers = nullptr;
        other._running = false;

        return *this;
      };
      
  };

}