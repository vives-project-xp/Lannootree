#pragma once

#include <unistd.h>
#include <sys/un.h>
#include <fcntl.h>
#include <sys/socket.h>

#include <i_thread_object.hpp>
#include <lannootree_config.hpp>

namespace Lannootree {

  class SocketThread : public IThreadObject {

    public:
      SocketThread(bool* running, Queue<Color>* queue);
      ~SocketThread();

    private:
      virtual void loop(void);

    private:
      std::string _socket_path = "lannootree.socket";

    private:
      int _socket_fd = 0;
      int _current_sock_fd = 0;

    private:
      bool* running = nullptr;
      Queue<Color>* queue = nullptr; 

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
        queue = other.queue;
        _socket_path = other._socket_path;

        other._socket_fd = 0;
        other._current_sock_fd = 0;
        other.running = nullptr;
        other.queue = nullptr;
        other._socket_path = "";

        return *this;
      }

  };

}
