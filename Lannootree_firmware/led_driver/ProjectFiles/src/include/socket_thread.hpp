#pragma once

#include <unistd.h>
#include <sys/un.h>
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

  };

}
