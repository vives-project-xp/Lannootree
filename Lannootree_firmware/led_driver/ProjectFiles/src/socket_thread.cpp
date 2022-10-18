#include <socket_thread.hpp>

namespace Lannootree {

  SocketThread::SocketThread(volatile bool* running, uint max_read, socket_callback_t callback)
    : SocketThread(running, max_read, callback, nullptr);

  SocketThread::SocketThread(volatile bool* running, uint max_read, socket_callback_t callback, void* arg) 
    : running(running), _max_read(max_read), _callback(callback), _arg(arg) {
    
    info_log("Creating socket...");
    if ((_socket_fd = socket(AF_UNIX, SOCK_STREAM, 0)) == -1) {
      error_log("Failed to create socket");
      *running = false;
    }

    fcntl(_socket_fd, F_SETFL, O_NONBLOCK);

    info_log("Initializing socket...");
    struct sockaddr_un serv_addr;
    bzero(&serv_addr, sizeof(serv_addr));
    serv_addr.sun_family = AF_UNIX;
    strcpy(serv_addr.sun_path, _socket_path.c_str());

    info_log("Binding socket...");
    if (bind(_socket_fd, (struct sockaddr*) &serv_addr, sizeof(serv_addr)) == -1) {
      error_log("Failed to bind to socket");
      *running = false;
    }

    info_log("Listening to socket...");
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
    fd_set rfds;
    struct timeval tv;
    int select_ret;

    struct sockaddr_un cli_addr;
    socklen_t cli_len = sizeof(cli_addr);

    char* buffer = new char[_max_read];    

    while (*running) {
      FD_ZERO(&rfds);
      FD_SET(_socket_fd, &rfds);

      tv.tv_sec = 1;
      tv.tv_usec = 0;

      select_ret = select(_socket_fd + 1, &rfds, NULL, NULL, &tv);

      if (select_ret == -1) {
        error_log("Error in select");
        continue;
      }

      else if (select_ret) {
        info_log("Accepting incomming connection");
        if ((_current_sock_fd = accept(_socket_fd, (struct sockaddr* ) & cli_addr, & cli_len)) == -1) continue;

        while (true) {
          int read_status = read(_current_sock_fd, buffer, _max_read);

          if (read_status == -1) {
            error_log("Failed to read socket");
            continue;
          }

          if (read_status == 0) {
            info_log("Client disconnected");
            break;
          }

          _callback(_arg, (uint8_t *) buffer, read_status);
        }

        close(_current_sock_fd);
      }
    }

    delete buffer;
  }

}
