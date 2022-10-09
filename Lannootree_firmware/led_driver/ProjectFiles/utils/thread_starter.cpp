#include <thread_starter.hpp>

namespace Lannootree {

  void ThreadStarter::join(std::string name) {
    auto itr = ThreadStarter::get()._thread_list.find(name);
    if (itr != ThreadStarter::get()._thread_list.end()) {
      itr->second.join();
    }

    get()._thread_list.erase(itr);    
  }

  void ThreadStarter::join_all(void) {
    std::vector<std::string> joined_threads;

    for (auto& [name, thread] : get()._thread_list) { 
      joined_threads.push_back(name);
      thread.join(); 
    }

    for (auto name : joined_threads) get()._thread_list.erase(name);
  }

}
