#include <led_buffer.hpp>

namespace Lannootree {

  /**
   * @brief Construct a new Led Buffer:: Led Buffer object
   * A double buffer class wich will block read/write until buffers have been swaped
   * 
   * @param buffer_size Size of both buffers
   */
  LedBuffer::LedBuffer(unsigned int buffer_size) : _buffer_size(buffer_size) {
    _buff0 = new uint32_t[buffer_size]();
    _buff1 = new uint32_t[buffer_size]();
  }

  LedBuffer::~LedBuffer() {
    delete[] _buff0;
    delete[] _buff1;
  }

  /**
   * @brief
   * Write data into the current buffer
   * 
   * @param data* pointer to read from
   * @param len  lenght of data
   * 
   * @returns false on shutdown request
   */
  bool LedBuffer::mem_write(uint32_t* data, size_t len) {
    std::unique_lock lock(_write_mtx);

    _write_sem.release();
    _swaped_buffers.wait(lock);
    
    if (_shutdown) return false;

    std::memcpy(*_next, data, len);
    return true;
  }

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
  bool LedBuffer::mem_read(uint32_t* data) {
    std::unique_lock lock(_read_mtx);

    _write_sem.acquire();
    
    if (_shutdown) return false;

    std::memcpy(data, *_current, _buffer_size * sizeof(uint32_t));
    return true;
  }

  /**
   * @brief Swapes the buffers
   * and notifies read/write opperation can be executed now
   */
  void LedBuffer::swap() noexcept {
    std::unique_lock lock0(_write_mtx);
    std::unique_lock lock1(_read_mtx);

    _swaped_buffers.notify_one();
    
    std::swap(_current, _next);
  }

  /**
   * @brief Notify threads blocking on read/write 
   * program is shutting down.
   */
  void LedBuffer::shutdown() {
    _shutdown = true;
    _swaped_buffers.notify_all();
    _write_sem.release();
  }

}
