#pragma once

#include <fcntl.h>
#include <unistd.h>

#include <sys/un.h>
#include <sys/socket.h>
#include <sys/select.h>

#include <matrix.hpp>
#include <i_thread_object.hpp>
#include <lannootree_config.hpp>

namespace Lannootree {

  typedef void (*socket_callback_t)(void* arg, uint8_t* data, size_t data_len);

  class UnixSocket {

    public:
      UnixSocket(std::string socket_path, uint max_read, socket_callback_t callback);
      UnixSocket(std::string socket_path, uint max_read, socket_callback_t callback, void* arg);
      ~UnixSocket();

    public:
      void start(void);
      void stop(void);

    public:
      void send_data(uint8_t* data, size_t data_len);

    private:
      void recv_loop(void);

    private:
      std::thread _t;
      bool _running = false;

    private:
      int _socket_fd = 0;
      int _current_sock_fd = 0;

    private:
      uint _max_read = 0;
      std::string _socket_path = ".socket";
      
    private:
      void* _arg = nullptr;
      socket_callback_t _callback = nullptr;

    // Make this this object only movable and not copyable because where encapsulating a socket.
    public:
      /** @brief UnixSocket is not copyable */
      UnixSocket(const UnixSocket&) = delete;

      /** @brief UnixSocket is not copyable */
      UnixSocket& operator=(const UnixSocket&) = delete;

      /** @brief UnixSocket is movable */
      UnixSocket(UnixSocket&& other) noexcept {
        *this = std::move(other);
      };

      /** @brief UnixSocket is movable */
      UnixSocket& operator=(UnixSocket&& other) {
        _socket_fd = other._socket_fd;
        _current_sock_fd = other._current_sock_fd;
        _socket_path = other._socket_path;
        _running = other._running;
        _arg = other._arg;
        _callback = other._callback;
        _t = std::move(other._t);

        other._socket_fd = 0;
        other._current_sock_fd = 0;
        other._socket_path = "";
        other._running = false;
        other._arg = nullptr;
        other._callback = nullptr;

        return *this;
      }

  };

}
