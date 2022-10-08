#pragma once

#include <mutex>
#include <queue>
#include <condition_variable>

namespace Lannootree {

  template <class T>
  class Queue {

    public:
      Queue(void) {};
      ~Queue() {};

    public:
      bool pop_blocking(T& val) {
        std::unique_lock<std::mutex> lock(_mtx);
        
        while (true) {
          if (_queue.empty()) {
            if (_shutdown) return false;
          } 
          else break;
          _can_pop.wait(lock);
        }

        val = std::move(_queue.front());
        _queue.pop();
        return true;
      }

      void push_blocking(T val) {
        {
          std::unique_lock<std::mutex> lock(_mtx);
          _queue.push(val);
        }
        _can_pop.notify_one();
      }

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
