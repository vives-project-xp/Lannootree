#pragma once

#include <mutex>
#include <queue>

namespace Lannootree {

  template <class T>
  class Queue {

    public:
      Queue(void) {};
      ~Queue() {};

    public:
      bool empty(void) {
        _mtx.lock();
        bool e = _queue.empty();
        _mtx.unlock();
        return e;
      }

    public:
      T pop_blocking(void) {
        _mtx.lock();
        T val = _queue.front();
        _queue.pop();
        _mtx.unlock();
        return val;
      }

      T try_pop(void) {
        if (!_mtx.try_lock()) return;
        T val = _queue.front();
        _queue.pop();
        _mtx.unlock();
        return val;
      }

    public:
      void push_blocking(T val) {
        _mtx.lock();
        _queue.push(val);
        _mtx.unlock();
      }

      void try_push(T val) {
        if (!_mtx.try_lock()) return;
        _queue.push(val);
        _mtx.unlock();
      }

    private:
      std::mutex _mtx;
      std::queue<T> _queue;

  };

}
