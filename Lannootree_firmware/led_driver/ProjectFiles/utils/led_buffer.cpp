#include <led_buffer.hpp>

namespace Lannootree {

  LedBuffer::LedBuffer(unsigned int buffer_size) : _buffer_size(buffer_size) {
    _buff0 = new uint32_t[buffer_size];
    _buff1 = new uint32_t[buffer_size];
  }

  LedBuffer::~LedBuffer() {
    delete[] _buff0;
    delete[] _buff1;
  }

  void LedBuffer::mem_write(uint32_t* data, size_t len) {
    std::unique_lock lock(_write_mtx);
    _swaped_buffers.wait(lock);
    std::memcpy(*_next, data, len);
  }

  void LedBuffer::mem_read(uint32_t* data) {
    std::unique_lock lock(_read_mtx);
    std::memcpy(data, *_current, _buffer_size * sizeof(uint32_t));
  }

  void LedBuffer::swap() noexcept {
    std::unique_lock lock0(_write_mtx);
    std::unique_lock lock1(_read_mtx);
    _swaped_buffers.notify_one();
    std::swap(_current, _next);
  }

}
