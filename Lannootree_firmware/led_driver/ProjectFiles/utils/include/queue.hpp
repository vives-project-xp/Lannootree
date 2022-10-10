#pragma once

#include <mutex>
#include <queue>
#include <condition_variable>

namespace Lannootree {

  /**
   * @brief Thread safe blocking queue with shutdown request.
   */
  template <class T>
  class Queue {

    public:
      /**
       * @brief Get first element out of queue in a blocking way
       *  
       * This method is thread safe.
       * 
       * @param val& value to write data to.
       * @return false on shutdown request, true otherwise.
       */
      bool pop(T& val) {
        std::unique_lock<std::mutex> lock(_mtx); // <-- Automatic mutex
        
        while (true) {
          if (_queue.empty()) {
            if (_shutdown) return false;
          } 
          else break;
          _can_pop.wait(lock); // <-- Mutex releases here / Also releases when out of scope
        }

        val = std::move(_queue.front());
        _queue.pop();
        return true;
      }

      /**
       * @brief Push a value on the queue.
       * 
       * This method is thread safe.
       * 
       * @param val Value to push
       */
      void push(T val) {
        {
          std::unique_lock<std::mutex> lock(_mtx);
          _queue.push(val);
        }
        _can_pop.notify_one(); // Notifies pop that value has been pushed
      }

      /**
       * @brief Request a shutdown request.
       * 
       * Can be used to notify thread blocking on pop() method to stop blocking,
       * and to shut down.
       * 
       */
      void request_shutdown() {
        {
          std::unique_lock<std::mutex> lock(_mtx);
          _shutdown = true;
        }
        _can_pop.notify_all();
      }

    private:
      bool _shutdown = false;
      std::mutex _mtx;
      std::queue<T> _queue;
      std::condition_variable _can_pop;

  };

}
