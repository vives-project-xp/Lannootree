#include <socket_thread.hpp>

namespace Lannootree {

  SocketThread::SocketThread(bool* running, Queue<Color>* queue): running(running), queue(queue)  {
    info_log("Creating socket....");
    if ((_socket_fd = socket(AF_UNIX, SOCK_STREAM, 0)) == -1) {
      error_log("Failed to create socket");
      *running = false;
    }

    info_log("Initializing socket....");
    struct sockaddr_un serv_addr;
    bzero(&serv_addr, sizeof(serv_addr));
    serv_addr.sun_family = AF_UNIX;
    strcpy(serv_addr.sun_path, _socket_path.c_str());

    info_log("Binding socket....");
    if (bind(_socket_fd, (struct sockaddr*) &serv_addr, sizeof(serv_addr)) == -1) {
      error_log("Failed to bind to socket");
      *running = false;
    }

    info_log("Listening to socket....");
    if (listen(_socket_fd, 20) == -1) {
      error_log("Failed to listen on socket");
      *running = false;
    }
  }

  SocketThread::~SocketThread() {
    if (_socket_fd) close(_socket_fd);
    if (access(_socket_path.c_str(), F_OK) != -1) unlink(_socket_path.c_str());
  }

  void SocketThread::loop(void) {
    struct sockaddr_un cli_addr;
    char buffer[1024] = { 0 };

    while (*running) {
      socklen_t cli_len = sizeof(cli_addr);
      if ((_current_sock_fd = accept(_socket_fd, (struct sockaddr*) &cli_addr, &cli_len)) == -1) {
        error_log("Failed to accept socket");
        continue;
      }

      while (true) {
        int read_status = read(_current_sock_fd, buffer, 1024);
        if (read_status == -1) {
          error_log("Failed to read socket");
          continue;
        }

        if (read_status == 0) {
          info_log("Client disconnected");
          break;
        }

        queue->push_blocking(Color(buffer[0], buffer[1], buffer[2]));
      }

      close(_current_sock_fd);
    }
  }

}
