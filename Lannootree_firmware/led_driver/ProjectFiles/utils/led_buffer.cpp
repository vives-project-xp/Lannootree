#include <led_buffer.hpp>

namespace Lannootree {

  LedBuffer::LedBuffer(unsigned int buffer_size) {
    _buff0 = new uint32_t[buffer_size];
    _buff1 = new uint32_t[buffer_size];
  }

  LedBuffer::~LedBuffer() {
    delete[] _buff0;
    delete[] _buff1;
  }

  void LedBuffer::write(size_t idx, uint32_t val) {
    std::lock_guard<std::mutex> lock(_write_mtx);
    (*_next)[idx] = val;
  }

  uint32_t const LedBuffer::read(size_t idx) {
    std::lock_guard<std::mutex> lock(_read_mtx);
    return (*_current)[idx];
  }

  void LedBuffer::swap() noexcept {
    std::scoped_lock lk(_write_mtx, _read_mtx);
    std::swap(_current, _next);
  }

}
