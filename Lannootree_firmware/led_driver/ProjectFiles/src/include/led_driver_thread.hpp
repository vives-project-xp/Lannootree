#pragma once

#include <i_thread_object.hpp>
#include <lannootree_config.hpp>

using json = nlohmann::json;

namespace Lannootree {
  
  class LedDriverThread : public IThreadObject {

    public:
      LedDriverThread(json config, bool* running, Queue<Color>* queue);
      ~LedDriverThread();

    private:
      virtual void loop(void);

    private:
      void init_ws2811(ws2811_t* ws, json& config, int dma, int gpio0, int gpio1, std::string chan);

    private:
      bool* running;

    private:
      Queue<Color>* queue;
      std::vector<ws2811_t*> _controllers;

  };

}
