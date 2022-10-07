#include <thread_starter.hpp>

namespace Lannootree {

  void ThreadStarter::add_thread(std::string name, thread_function f) {
    auto itr = ThreadStarter::get()._thread_list.find(name);
    if (itr == ThreadStarter::get()._thread_list.end()) {
      ThreadStarter::get()._thread_list[name] = std::thread(f, nullptr);
    }
  }

  void ThreadStarter::add_thread(std::string name, thread_function f, void* args) {
    auto itr = ThreadStarter::get()._thread_list.find(name);
    if (itr == ThreadStarter::get()._thread_list.end()) {
      ThreadStarter::get()._thread_list[name] = std::thread(f, args);
    }
  }

  void ThreadStarter::join_all(void) {
    for (auto& t : ThreadStarter::get()._thread_list) {
      t.second.join();
    }
  }

  void ThreadStarter::join(std::string name) {
    auto itr = ThreadStarter::get()._thread_list.find(name);
    if (itr != ThreadStarter::get()._thread_list.end()) {
      itr->second.join();
    }    
  }

}
