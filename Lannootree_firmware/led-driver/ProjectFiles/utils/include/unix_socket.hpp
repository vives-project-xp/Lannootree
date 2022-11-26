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
       * socket_callback_t (void* arg, uint8_t* datan size_t data_len) 
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
       * socket_callback_t (void* arg, uint8_t* datan size_t data_len) 
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
       * Stop the UnixSocket
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

    public:
      /**
       * @brief 
       * 
       * @return true 
       * When a client is connected,
       * 
       * @return false 
       * When no client is connected
       */
      bool client_connected(void) { return _current_sock_fd != 0; };

    private:
      void recv_loop(void);

    private:
      std::thread _t;
      bool _running = false;
      std::vector<uint8_t> _buffer;

    private:
      int _socket_fd = 0;
      int _current_sock_fd = 0;

    private:
      uint _max_read = 0;
      std::string _socket_path = ".socket";
      
    private:
      void* _arg = nullptr;
      socket_callback_t _callback = nullptr;

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
        _socket_fd = other._socket_fd;
        _current_sock_fd = other._current_sock_fd;
        _socket_path = other._socket_path;
        _running = other._running;
        _arg = other._arg;
        _callback = other._callback;
        _t = std::move(other._t);

        other._socket_fd = 0;
        other._current_sock_fd = 0;
        other._socket_path = "";
        other._running = false;
        other._arg = nullptr;
        other._callback = nullptr;

        return *this;
      }

  };

}
