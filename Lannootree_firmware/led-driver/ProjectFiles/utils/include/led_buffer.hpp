#pragma once

#include <mutex>
#include <stdint.h>
#include <semaphore.hpp>
#include <cstdint>
#include <cstring>
#include <condition_variable>

namespace Lannootree {

  class LedBuffer {

    public:
      LedBuffer(unsigned int buffer_size);
      ~LedBuffer();

    public:
      void mem_write(uint32_t* data, size_t len);
      void mem_read(uint32_t* data);

    public:
      void swap() noexcept;

    private:
      uint32_t* _buff0;
      uint32_t* _buff1;

      uint32_t** _next = &_buff0;
      uint32_t** _current = &_buff1;

    private:
      uint _buffer_size = 0;

    private:
      int writen = 0;
      mutable std::mutex _read_mtx;
      std::mutex _write_mtx;
      std::condition_variable _swaped_buffers;

    private:
      semaphore _write_sem;

  };

}
