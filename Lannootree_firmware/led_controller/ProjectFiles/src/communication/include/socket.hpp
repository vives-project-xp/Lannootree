#pragma once

#include <signal.h>
#include <pthread.h>
#include <string>

namespace Lannootree::communication {

  class Socket {
    public:
      Socket();
      ~Socket();

    public:
      bool start(void);
      void stop(void);
      
    public:
      void set_socket_path(const std::string& path);

    public:
      enum class SocketEnum {
        MAX_BACKLOG = 20,
        BUFFER_SIZE = 8192
      };

    private:
      static void* thread_starter(void* obj);
    
    private:
      void* run_server(void);
      void cleanup_socket(void);

    private:
      pthread_t pid_;
      pthread_mutex_t mutex_;
      std::string socket_path_;
      int sockfd_;
      int curr_sock_fd_;

  };

}
