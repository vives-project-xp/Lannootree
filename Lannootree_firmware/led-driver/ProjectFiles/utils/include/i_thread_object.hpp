#pragma once

namespace Lannootree {

  class IThreadObject {

    private:
      /**
       * @brief Loop of thread object will be called when () operator gets used in ThreadStarter
       */
      virtual void loop(void) = 0;

    public:
      void operator()() {
        loop();
      };

  };

}
