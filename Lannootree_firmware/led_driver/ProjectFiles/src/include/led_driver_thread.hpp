#pragma once

#include <i_thread_object.hpp>
#include <lannootree_config.hpp>

using json = nlohmann::json;

namespace Lannootree {
  
  class LedDriverThread : public IThreadObject {

    public:
      LedDriverThread(json& config, Queue<Color>* queue);
      ~LedDriverThread();

    private:
      virtual void loop(void);

    private:
      /** @brief Initialize the ws2811 structure */
      void init_ws2811(ws2811_t* ws, json& config, int dma, int gpio0, int gpio1, std::string chan);

    private:
      Queue<Color>* queue;
      std::vector<ws2811_t*> _controllers;

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
        queue = other.queue;
        other.queue = nullptr;
        
        _controllers = std::move(other._controllers);
        
        return *this;
      };
      
  };

}
