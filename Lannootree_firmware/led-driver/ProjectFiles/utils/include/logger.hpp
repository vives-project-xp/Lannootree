#pragma once

#include <string>
#include <sstream>

#include <unix_socket.hpp>
#include <terminal_colors.hpp>

#define LOG_INFO "[INFO] "
#define LOG_WARN "[WARN] "
#define LOG_ERROR "[ERROR] "

namespace Lannootree {

  // Logging types
  enum class LogType {
    DEFAULT,
    INFO,
    WARN,
    ERROR
  };

  /**
   * @brief Singleton logging system that writes logs to a UnixSocket, with different loggings levels
   * 
   */
  class Logger {

    public:
      /**
       * @brief Get static logger instance
       * 
       * @return Logger& 
       */
      static Logger& Get(void) {
        static Logger instance;
        return instance;
      }

    private:
      Logger();
      ~Logger();

    private:
      friend std::string prep_level(Logger& l);

    public:
      /**
       * @brief Use logger class as string stream logging over mqtt
       * 
       * @tparam T 
       * @param l 
       * @param s 
       * @return Logger& 
       */
      template <typename T>
      friend Logger& operator<<(Logger& l, const T& s);

      inline Logger& operator()(LogType type) {
        Get()._current_logtype = type;
        Get()._o_stream << prep_level(*this);
        return *this;
      }

    private:
      UnixSocket _socket;
      LogType _current_logtype;
      std::stringstream _o_stream;

  };

  template <typename T>
  Logger& operator<<(Logger& l, const T& s) {
    l._o_stream << s;
    
    std::string msg = l._o_stream.str();
    l._socket.send_data((uint8_t *) msg.c_str(), msg.size());
    l._o_stream.str(std::string());

    return l;
  }


}
