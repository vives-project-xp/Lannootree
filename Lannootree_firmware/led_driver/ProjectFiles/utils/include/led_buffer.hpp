#pragma once

#include <mutex>
#include <stdint.h>

namespace Lannootree {

  class LedBuffer {

    public:
      LedBuffer(unsigned int buffer_size);
      ~LedBuffer();

    public:
      void write(size_t idx, uint32_t value);
      uint32_t const read(size_t idx);

    public:
      void swap() noexcept;

    private:
      uint32_t* _buff0;
      uint32_t* _buff1;

      uint32_t** _next = &_buff0;
      uint32_t** _current = &_buff1;

    private:
      mutable std::mutex _read_mtx;
      std::mutex _write_mtx;

  };

}
