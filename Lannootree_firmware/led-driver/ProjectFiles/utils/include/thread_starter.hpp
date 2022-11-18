#pragma once

#include <unordered_map>
#include <i_thread_object.hpp>
#include <lannootree_config.hpp>

namespace Lannootree {

  class ThreadStarter {

    public:
      /**
       * @brief Add and execute a thread.
       * 
       * @tparam Callable Can be function pointer / lambda / IThreadObject*
       * 
       * @param name Name which thread can be referenced by.
       * 
       * @param f Gets passed to std::thread using std::move
       * @param args Get passed to std::thread
       * 
       */
      template <typename Callable, typename... Args>
      static void add_thread(std::string name, Callable f, Args... args) {
        auto itr = get()._thread_list.find(name);
        if (itr != get()._thread_list.end()) return;

        // Check at compile time if Callable is pointer to an IThreadObject instance
        if constexpr (std::is_pointer_v<Callable> && std::is_base_of_v<IThreadObject, std::remove_pointer_t<Callable>>) {
          get()._thread_list[name] = std::thread(std::move(*f), args...);
          // Delete hollow object now we can pass IThreadObject in as new IThreadObject
          delete f;
        }

        // TODO: Add other cases
        
        else {
          get()._thread_list[name] = std::thread(std::move(f), args...);
        } 
      };

    private:
      /**
       * @brief Get the static refrence of ThreadStarter object
       * 
       * @return ThreadStarter& 
       */
      static ThreadStarter& get(void) {
        static ThreadStarter instance;
        return instance;
      }

    public:
      /**
       * @brief Wait for all threads to join and delete them.
       */
      static void join_all(void);

      /**
       * @brief Wait for thread to join and delet it.
       * 
       * @param name Name used to reference thread
       */
      static void join(std::string name);

    private:
      // Private (de)constructor because sigelton
      ThreadStarter(void) {};
      ~ThreadStarter() {};

    private:
      std::unordered_map<std::string, std::thread> _thread_list;

    public:
      // Delete copy constructor because singleton
      ThreadStarter(ThreadStarter const&)  = delete;
      void operator=(ThreadStarter const&) = delete;

  };

}
