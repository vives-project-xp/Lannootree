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

  class SocketThread : public IThreadObject {

    public:
      SocketThread(volatile bool* running, uint max_read, socket_callback_t callback);
      SocketThread(volatile bool* running, uint max_read, socket_callback_t callback, void* arg);
      ~SocketThread();

    private:
      virtual void loop(void);

    private:
      std::string _socket_path = "./dev/lannootree.socket";

    private:
      int _socket_fd = 0;
      int _current_sock_fd = 0;

    private:
      volatile bool* running = nullptr;
      
    private:
      uint _max_read = 0;
      void* _arg = nullptr;
      socket_callback_t _callback = nullptr;

    // Make this this object only movable and not copyable because where encapsulating a socket.
    public:
      /** @brief SocketThread is not copyable */
      SocketThread(const SocketThread&) = delete;

      /** @brief SocketThread is not copyable */
      SocketThread& operator=(const SocketThread&) = delete;

      /** @brief SocketThread is movable */
      SocketThread(SocketThread&& other) noexcept {
        *this = std::move(other);
      };

      /** @brief SocketThread is movable */
      SocketThread& operator=(SocketThread&& other) {
        _socket_fd = other._socket_fd;
        _current_sock_fd = other._current_sock_fd;
        running = other.running;
        _socket_path = other._socket_path;
        _matrix = other._matrix;

        other._socket_fd = 0;
        other._current_sock_fd = 0;
        other.running = nullptr;
        other._socket_path = "";
        other._matrix = nullptr;

        return *this;
      }

  };

}
