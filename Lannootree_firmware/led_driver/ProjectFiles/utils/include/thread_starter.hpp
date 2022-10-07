#pragma once

#include <thread>
#include <string>
#include <unordered_map>

namespace Lannootree {

  typedef void (*thread_function)(void*);

  class ThreadStarter {

    public:
      static ThreadStarter& get(void) {
        static ThreadStarter instance;
        return instance;
      }

    public:
      static void add_thread(std::string name, thread_function f);
      static void add_thread(std::string name, thread_function f, void* args);

    public:
      static void join_all(void);
      static void join(std::string name);

    private:
      ThreadStarter(void) {};
      ~ThreadStarter() {};

    private:
      std::unordered_map<std::string, std::thread> _thread_list;

    public:
      ThreadStarter(ThreadStarter const&)  = delete;
      void operator=(ThreadStarter const&) = delete;

  };

}
