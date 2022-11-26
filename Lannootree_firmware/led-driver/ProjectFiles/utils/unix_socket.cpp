#include <unix_socket.hpp>

namespace Lannootree {

  UnixSocket::UnixSocket(std::string socket_path, uint max_read, socket_callback_t callback)
    : UnixSocket(socket_path, max_read, callback, nullptr) { };

  UnixSocket::UnixSocket(std::string socket_path, uint max_read, socket_callback_t callback, void* arg) 
    : _socket_path(socket_path), _max_read(max_read), _callback(callback), _arg(arg) {
    
    std::cout << "Creating socket...\n";
    if ((_socket_fd = socket(AF_UNIX, SOCK_STREAM, 0)) == -1) {
      std::cout << "Failed to create socket\n";
    }

    unlink(_socket_path.c_str());

    fcntl(_socket_fd, F_SETFL, O_NONBLOCK);

    std::cout << "Initializing socket...\n";
    struct sockaddr_un serv_addr;
    bzero(&serv_addr, sizeof(serv_addr));
    serv_addr.sun_family = AF_UNIX;
    strcpy(serv_addr.sun_path, _socket_path.c_str());

    std::cout << "Binding socket...\n";
    if (bind(_socket_fd, (struct sockaddr*) &serv_addr, sizeof(serv_addr)) == -1) {
      std::cout << "Failed to bind to socket\n";
    }

    std::cout << "Listening to socket...\n";
    if (listen(_socket_fd, 20) == -1) {
      std::cout << "Failed to listen on socket\n";
    }

    std::cout << std::endl;
  }

  UnixSocket::~UnixSocket() {}

  void UnixSocket::start(void) {
    _running = true;
    _t = std::thread(&UnixSocket::recv_loop, this);
  }

  void UnixSocket::stop(void) {
    _running = false;
    if (_current_sock_fd) {
      close(_current_sock_fd);
    }

    close(_socket_fd);
    
    unlink(_socket_path.c_str());
    
    _t.join();
  }

  void UnixSocket::send_data(uint8_t* data, size_t data_len) {
    std::cout << "Trying to send data\n" << std::endl;

    if (_current_sock_fd == 0) {
      std::cout << "No client connected buffering data\n";
      for (int i = 0; i < data_len; i++) {
        _buffer.push_back(data[i]);
      }
      return;
    }

    ssize_t bytes_send = write(_current_sock_fd, data, data_len);
    if (bytes_send == -1) {
      std::cout << "Failed to send over unix socket\n";
    } else {
      std::cout << "Send: " << std::to_string(bytes_send) << " bytes over socket\n";
    }
  }

  void UnixSocket::recv_loop(void) {
    fd_set rfds;
    struct timeval tv;
    int select_ret;

    struct sockaddr_un cli_addr;
    socklen_t cli_len = sizeof(cli_addr);

    char* buffer = new char[_max_read];    

    while (_running) {
      FD_ZERO(&rfds);
      FD_SET(_socket_fd, &rfds);

      tv.tv_sec = 1;
      tv.tv_usec = 0;

      select_ret = select(_socket_fd + 1, &rfds, NULL, NULL, &tv);

      if (select_ret == 0) continue;

      if (select_ret == -1) {
        std::cout << "Error in select\n";
        continue;
      }

      else if (select_ret) {
        std::cout << "Accepting incomming connection\n";
        if ((_current_sock_fd = accept(_socket_fd, (struct sockaddr* ) & cli_addr, & cli_len)) == -1) continue;

        // Send buffered messages to connected client
        if (_buffer.size() > 0) {
          send_data(_buffer.data(), _buffer.size());
          _buffer.clear();
        }

        std::cout << "Stating receive loop" << std::endl;

        while (_running) {
          int read_status = read(_current_sock_fd, buffer, _max_read);

          if (read_status == -1) {
            std::cout << "Failed to read socket\n";
            continue;
          }

          if (read_status == 0) {
            std::cout << "Client disconnected\n";
            break;
          }

          _callback(_arg, (uint8_t *) buffer, read_status); // User defined callback
        }

        close(_current_sock_fd);
        _current_sock_fd = 0;
      }
    }

    delete[] buffer;
  }

}
