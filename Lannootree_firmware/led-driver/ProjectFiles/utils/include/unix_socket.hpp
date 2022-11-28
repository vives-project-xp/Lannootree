#pragma once

#include <string>
#include <thread>
#include <chrono>
#include <fstream>
#include <iostream>
#include <fcntl.h>
#include <unistd.h>

#include <vector>

#include <sys/un.h>
#include <sys/socket.h>
#include <sys/select.h>

namespace Lannootree {

  typedef void (*socket_callback_t)(void* arg, uint8_t* data, size_t data_len);

  /**
   * @brief A UnixSocket that runs in the backgroud to receive and send data to a connected client.
   * @code
   * Example use:
   * 
   * #include <iostream>
   * #include <unix_socket.hpp>
   * 
   * void socket_callback(void* arg, uint8_t* data, size_t len) {
   *    std::cout << "Received data on socket" << std::endl;
   * 
   *    for (int i = 0; i < len; i++) {
   *      std::cout << " " << data[i];
   *    }
   *    std::endl;
   * }
   * 
   * Lannootree::UnixSocket socket("./my_socket.socket", 150, socket_callback);
   * 
   * int main() {
   *  socket.start();
   *  
   *  // DO OTHER THINGS HERE
   * 
   *  socket.stop();
   * 
   *  return 0;
   * }
   * @endcode 
   */

  class UnixSocket {

    public:
      /**
       * @brief Construct a new Unix Socket object
       * 
       * @param socket_path 
       * 
       * Path and name where to create UnixSocket
       * 
       * @param max_read 
       * Maximum bytes to read from connected client
       * 
       * @param callback
       * User defined function to handel incomming data.
       */
      UnixSocket(std::string socket_path, uint max_read, socket_callback_t callback);
      
      /**
       * @brief Construct a new Unix Socket object
       * 
       * @param socket_path 
       * 
       * Path and name where to create UnixSocket
       * 
       * @param max_read 
       * Maximum bytes to read from connected client
       * 
       * @param callback
       * User defined function to handel incomming data.
       * 
       * @param arg
       * Agument pointer to get passed to the callback function
       */
      UnixSocket(std::string socket_path, uint max_read, socket_callback_t callback, void* arg);
      
      ~UnixSocket();

    public:
      /**
       * @brief 
       * 
       * Start activly using UninxSocket
       * 
       */
      void start(void);

      /**
       * @brief 
       * 
       * Stop the UnixSocket an join thread
       * 
       */
      void stop(void);

    public:
      /**
       * @brief 
       * 
       * Send data over the unix socket to the listening client,
       * Note: This will buffer the data when no client is connected,
       * when a client connect this buffer will be send to the connecting client.
       * 
       * @param data 
       * Pointer to data to send
       * @param data_len 
       * Lenght of data to send
       */
      void send_data(uint8_t* data, size_t data_len);

    private:
      void socket_thread(void);
      void client_thread(void);

    private:
      bool m_running = false;
    
    private:
      std::thread m_thread;
      std::vector<uint8_t> m_buffer;

    private:
      int m_socket_fd = 0;
      int m_client_sock_fd = 0;

    private:
      uint m_max_read = 0;
      std::string m_socket_path = ".socket";
      
    private:
      void* m_arg = nullptr;
      socket_callback_t m_callback = nullptr;

    // Make this this object only movable and not copyable because where encapsulating a socket.
    public:
      /** @brief UnixSocket is not copyable */
      UnixSocket(const UnixSocket&) = delete;

      /** @brief UnixSocket is not copyable */
      UnixSocket& operator=(const UnixSocket&) = delete;

      /** @brief UnixSocket is movable */
      UnixSocket(UnixSocket&& other) noexcept {
        *this = std::move(other);
      };

      /** @brief UnixSocket is movable */
      UnixSocket& operator=(UnixSocket&& other) {
        m_socket_fd = other.m_socket_fd;
        m_client_sock_fd = other.m_client_sock_fd;
        m_socket_path = other.m_socket_path;
        m_running = other.m_running;
        m_arg = other.m_arg;
        m_callback = other.m_callback;
        m_thread = std::move(other.m_thread);

        other.m_socket_fd = 0;
        other.m_client_sock_fd = 0;
        other.m_socket_path = "";
        other.m_running = false;
        other.m_arg = nullptr;
        other.m_callback = nullptr;

        return *this;
      }

  };

}
