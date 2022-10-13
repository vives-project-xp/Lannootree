#include <socket_thread.hpp>

namespace Lannootree {

  SocketThread::SocketThread(volatile bool* running, Matrix< std::tuple<uint, uint32_t*> >* matrix) : running(running), _matrix(matrix)  {
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
    struct sockaddr_un cli_addr;
    socklen_t cli_len = sizeof(cli_addr);


    fd_set rfds;
    struct timeval tv;
    int select_ret;

    auto[width, height] = _matrix -> dimention();
    int max_read = (width * height) * 3;
    char * buffer = new char[max_read];

    while (*running) {
      FD_ZERO(&rfds);
      FD_SET(_socket_fd, &rfds);

      tv.tv_sec = 1;
      tv.tv_usec = 0;

      select_ret = select(_socket_fd + 1, &rfds, NULL, NULL, &tv);

      if (select_ret == -1) {
        error_log("Error in select");
        continue;
      } else if (select_ret) {
        info_log("Accepting incomming connection");
        if ((_current_sock_fd = accept(_socket_fd, (struct sockaddr* ) & cli_addr, & cli_len)) == -1) continue;

        while (true) {
          int read_status = read(_current_sock_fd, buffer, max_read);

          if (read_status == -1) {
            error_log("Failed to read socket");
            continue;
          }

          if (read_status == 0) {
            info_log("Client disconnected");
            break;
          }

          auto[width, height] = _matrix -> dimention();

          /**
           * @brief Values to skip
           * 
           * (1, 1) (1, 5) (1, 8)
           * (5, 1) (5, 5) (5, 8)
           * (8, 1) (8, 5) (8, 8)
           * 
           */

          for (int row = 0; row < height; row++) {
            for (int col = 0; col < width; col++) {
              int red_index = 3 * (width * row + col);
              int green_index = red_index + 1;
              int blue_index = green_index + 1;
              
              Color c(buffer[red_index], buffer[green_index], buffer[blue_index]);

              auto offset = std::get<0>(_matrix -> get_value(col, row));
              info_log("adding color to mem offset " << offset);
              auto memory = std::get<1>(_matrix->get_value(col, row));
              info_log("Memory: " << memory);

              uint32_t color = c.to_uint32_t();

              for (int i = 0; i < 72; i++) memory[offset + i] = color;
              
            }
          }
        }

        close(_current_sock_fd);
      }
    }

    delete buffer;
  }

}
