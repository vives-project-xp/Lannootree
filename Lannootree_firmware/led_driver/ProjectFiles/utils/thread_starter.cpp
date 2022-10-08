#include <thread_starter.hpp>

namespace Lannootree {

  void ThreadStarter::join(std::string name) {
    auto itr = ThreadStarter::get()._thread_list.find(name);
    if (itr != ThreadStarter::get()._thread_list.end()) {
      itr->second.join();
    }

    get()._thread_list.erase(itr);    
  }

}
