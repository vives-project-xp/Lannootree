#pragma once

#include <matrix.hpp>
#include <i_thread_object.hpp>
#include <lannootree_config.hpp>

using json = nlohmann::json;

namespace Lannootree {
  
  class LedDriverThread : public IThreadObject {

    public:
      LedDriverThread(json& config, Matrix< std::tuple<uint, uint32_t*> >* matrix);
      ~LedDriverThread();

    private:
      virtual void loop(void);

    private:
      void initialize_memory(json& config);
      ws2811_t* create_ws2811(json& config, int dma, int gpio1, int gpio2, std::string channel);

    private:
      Matrix< std::tuple<uint, uint32_t*> >* _matrix;
      std::vector<ws2811_t*> _controllers;
      std::unordered_map<std::string, uint32_t*> _channel_mem;

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
        _channel_mem = std::move(other._channel_mem);
        _controllers = std::move(other._controllers);
        
        return *this;
      };

      // Make this this object only movable and not copyable so no extra heap allocations are needed
      // No realy necessary here.
      
  };

}
