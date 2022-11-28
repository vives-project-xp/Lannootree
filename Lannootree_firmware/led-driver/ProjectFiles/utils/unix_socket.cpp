#include <unix_socket.hpp>

namespace Lannootree {

  UnixSocket::UnixSocket(std::string socket_path, uint max_read, socket_callback_t callback)
    : UnixSocket(socket_path, max_read, callback, nullptr) { };

  UnixSocket::UnixSocket(std::string socket_path, uint max_read, socket_callback_t callback, void* arg) 
    : m_socket_path(socket_path), m_max_read(max_read), m_callback(callback), m_arg(arg) {
    
    // Unlink socket and delete socket if not closed on previous creation
    unlink(m_socket_path.c_str());

    // Create socket and get fd
    std::cout << "Creating socket...\n";
    if ((m_socket_fd = socket(AF_UNIX, SOCK_STREAM, 0)) == -1) { 
      std::cout << "Failed to create socket\n";
    }

    // Set socket in non-blocking mode
    fcntl(m_socket_fd, F_SETFL, O_NONBLOCK);

    // Create unix socket address set family and path
    std::cout << "Initializing socket...\n";
    struct sockaddr_un serv_addr;
    bzero(&serv_addr, sizeof(serv_addr));

    serv_addr.sun_family = AF_UNIX;
    strcpy(serv_addr.sun_path, m_socket_path.c_str());
    
    // Bind socket to socket address
    std::cout << "Binding socket...\n";
    if (bind(m_socket_fd, (struct sockaddr*) &serv_addr, sizeof(serv_addr)) == -1) {
      std::cout << "Failed to bind to socket\n";
    }

    // Activly start listening on socket with max backlog of 1
    std::cout << "Listening to socket...\n";
    if (listen(m_socket_fd, 1) == -1) {
      std::cout << "Failed to listen on socket\n";
    }

    std::cout << std::endl;
  }

  UnixSocket::~UnixSocket() {}

  void UnixSocket::start(void) {
    m_running = true;
    m_thread = std::thread(&UnixSocket::socket_thread, this);
  }

  void UnixSocket::stop(void) {
    m_running = false;
    
    // Disconnect any connected clients
    if (m_client_sock_fd) {
      close(m_client_sock_fd);
    }

    // Close and delete socket
    close(m_socket_fd);
    unlink(m_socket_path.c_str());
    
    // Wait for thread to join main thread
    m_thread.join();
  }

  void UnixSocket::send_data(uint8_t* data, size_t data_len) {
    // If no client is connected buffer the data
    if (m_client_sock_fd == 0) {
      for (int i = 0; i < data_len; i++) {
        m_buffer.push_back(data[i]);
      }
      return;
    }

    // Send data to connected client
    ssize_t bytes_send = write(m_client_sock_fd, data, data_len);
    if (bytes_send == -1) {
      std::cout << "Failed to send over unix socket\n";
    } else {
      std::cout << "Send: " << std::to_string(bytes_send) << " bytes over socket\n";
    }
  }

  void UnixSocket::socket_thread(void) {    
    // Setting up of select functionality
    fd_set rfds;
    int select_ret;
    struct timeval tv;

    while (m_running) {
      // Reset fd_set to 0 then add socket fd to it
      FD_ZERO(&rfds);
      FD_SET(m_socket_fd, &rfds);

      // Resetting select timeout to one second
      tv.tv_sec = 1;
      tv.tv_usec = 0;

      select_ret = select(m_socket_fd + 1, &rfds, NULL, NULL, &tv);

      // No incomming connection or some error we will ignore try again
      if (select_ret == 0 || select_ret == -1) continue;

      // A client connected
      client_thread();
    }

  }

  void UnixSocket::client_thread(void) {
    // Create a client aderess structure
    struct sockaddr_un cli_addr;
    socklen_t cli_len = sizeof(cli_addr);

    // Get the connected client's fd
    std::cout << "Accepting incomming connection\n";
    if ((m_client_sock_fd = accept(m_socket_fd, (struct sockaddr* ) & cli_addr, & cli_len)) == -1) {
      return;
    };

    // Allocate memory of size max_read
    char* buffer = new char[m_max_read]; 
    
    // Send buffered messages to connected client
    if (m_buffer.size() > 0) {
      send_data(m_buffer.data(), m_buffer.size());
      m_buffer.clear();
    }

    while (m_running) {
      int read_status = read(m_client_sock_fd, buffer, m_max_read);

      if (read_status == -1) {
        std::cout << "Failed to read socket\n";
        continue;
      }

      if (read_status == 0) {
        std::cout << "Client disconnected\n";
        break;
      }

      // Make call to user defined callback
      m_callback(m_arg, (uint8_t *) buffer, read_status); 
    }

    close(m_client_sock_fd);
    m_client_sock_fd = 0;

    delete[] buffer;
  }

}
