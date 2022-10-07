#include <lannootree.hpp>

namespace Lannootree {

  LannooTree::LannooTree(std::ifstream& f) 
  : config(json::parse(f)), 
    led_task(config, &_running, &_color_queue),
    socket_task(&_running, &_color_queue) { start(); }

  LannooTree::~LannooTree() {}

  void LannooTree::start(void) {
    info_log("Starting lannootree firmware");

    ThreadStarter::add_thread("LedDriver", led_task);
    ThreadStarter::add_thread("Socket", socket_task);

    ThreadStarter::join_all();
  }

}
