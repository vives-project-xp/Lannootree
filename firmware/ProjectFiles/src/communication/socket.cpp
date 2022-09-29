#include <stdlib.h>
#include <sys/socket.h>
#include <sys/un.h>
#include <unistd.h>

#include <lannootree_config.hpp>

namespace Lannootree::communication {

  Socket::Socket(void)
    : pid_(0),
      socket_path_(".socket"),
      sockfd_(0),
      curr_sock_fd_(0) {
    info_log("Init mutex...\n");
    pthread_mutex_init(&mutex_, NULL);
  }

  Socket::~Socket() {
    stop();
  }

  bool Socket::start(void) {
    info_log("Creating thread...\n");
    if (pthread_create(&pid_, NULL, &(Socket::thread_starter), this) != 0) {
      error_log("Error: Failed to start thread\n");
      return false;
    }

    info_log("Thread created\n");
    return true;
  }

  void Socket::stop(void) {
    info_log("Destroying mutex...\n");
    pthread_mutex_destroy(&mutex_);
    if (pid_) {
      pthread_cancel(pid_);
      pid_ = 0;
    }
    if (sockfd_) {
      close(sockfd_);
      sockfd_ = 0;
    }
    cleanup_socket();
  }

  void Socket::set_socket_path(const std::string& path) {
    socket_path_ = path;
  }

  void *Socket::thread_starter(void *obj) {
    info_log("Starting thread starter...\n");
    return reinterpret_cast<Socket *>(obj)->run_server();
  }

  void *Socket::run_server(void) {
    info_log("Starting thread server...\n");
    if (pthread_mutex_trylock(&mutex_) != 0) {
      error_log("Error: Failed to lock mutex thread\n");
      return NULL;
    }

    cleanup_socket();

    info_log("Creating socket...\n");
    if ((sockfd_ = socket(AF_UNIX, SOCK_STREAM, 0)) == -1) {
      error_log("Error: Failed to create socket\n");
      return NULL;
    }

    info_log("Initializing socket...\n");
    struct sockaddr_un serv_addr;
    bzero(&serv_addr, sizeof(serv_addr));
    serv_addr.sun_family = AF_UNIX;
    strcpy(serv_addr.sun_path, socket_path_.c_str());

    info_log("Binding socket...\n");
    if (bind(sockfd_, (struct sockaddr*) &serv_addr, sizeof(serv_addr)) == -1) {
      error_log("Error: Failed to bind socket\n");
      return NULL;
    }

    info_log("Listening socket...\n");
    if (listen(sockfd_, (int) SocketEnum::MAX_BACKLOG) == -1) {
      error_log("Error: Failed to listen to socket\n");
      return NULL;
    }

    struct sockaddr_un cli_addr;
    char buffer[(int) SocketEnum::BUFFER_SIZE + 1];
    while (true) {
      socklen_t cli_len = sizeof(cli_addr);
      if ((curr_sock_fd_ = accept(sockfd_, (struct sockaddr *)&cli_addr, &cli_len)) == -1) {
        error_log("Error: Failed to accept socket\n");
        continue;
      }
      bzero(buffer, (int) SocketEnum::BUFFER_SIZE + 1);
      if (read(curr_sock_fd_, buffer, (int) SocketEnum::BUFFER_SIZE) == -1) {
        error_log("Error: Failed to read socket\n");
        continue;
      }
      info_log("=> read buffer [%s]\n", buffer);
      close(curr_sock_fd_);
    }
  }

  void Socket::cleanup_socket(void) {
    if (access(socket_path_.c_str(), F_OK) != -1) {
      info_log("Cleanup socket\n");
      unlink(socket_path_.c_str());
    }
  }

}
