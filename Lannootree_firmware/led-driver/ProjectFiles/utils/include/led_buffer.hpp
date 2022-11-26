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
      /**
     * @brief Construct a new Led Buffer:: Led Buffer object
     * A double buffer class wich will block read/write until buffers have been swaped
     * 
     * @param buffer_size Size of both buffers
     */
      LedBuffer(unsigned int buffer_size);
      ~LedBuffer();

    public:
      /**
       * @brief
       * Write data into the current buffer
       * 
       * @param data* pointer to read from
       * @param len  lenght of data
       * 
       * @returns false on shutdown request
       */
      bool mem_write(uint32_t* data, size_t len);

      /**
       * @brief
       * Copies the buffer to data pointer
       * Note this will copy the whole buffer of size buffer_size to the location,
       * there is no safety check.
       * 
       * @param data pointer to write to
       * 
       * @returns false on shutdown request
       */
      bool mem_read(uint32_t* data);

    public:
      /**
       * @brief Swapes the buffers
       * and notifies read/write opperation can be executed now
       */
      void swap() noexcept;

    public:
      /**
       * @brief Notify threads blocking on read/write 
       * program is shutting down.
       */
      void shutdown();

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

    private:
      bool _shutdown = false;

  };

}
