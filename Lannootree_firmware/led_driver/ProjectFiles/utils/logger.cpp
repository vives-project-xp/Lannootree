#include <logger.hpp>

namespace Lannootree {
  
  Logger::Logger(): _socket("./dev/logging.socket", 50, [](void* arg, uint8_t* data, size_t len) {}) {
    _socket.start();
  }

  Logger::~Logger() {
    _socket.stop();
  }

  std::string prep_level(Logger& l) {
    switch (l._current_logtype) {
      case LogType::INFO:
        return LOG_INFO;

      case LogType::WARN:
        return LOG_WARN;

      case LogType::ERROR:
        return LOG_ERROR;

      default:
        return "";
    }
  }

}
