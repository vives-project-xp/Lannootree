#pragma once

#include <unordered_map>
#include <lannootree_config.hpp>

namespace Lannootree {

  class ThreadStarter {

    public:
      template <typename Callable, typename... Args>
      static void add_thread(std::string name, Callable &f, Args... args) {
        auto itr = get()._thread_list.find(name);
        if (itr == get()._thread_list.end()) {
          get()._thread_list[name] = std::thread(std::move(f), args...);
        }
      };

    private:
      static ThreadStarter& get(void) {
        static ThreadStarter instance;
        return instance;
      
      }
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
