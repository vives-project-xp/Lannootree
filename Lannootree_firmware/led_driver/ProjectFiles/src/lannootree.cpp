#include <lannootree.hpp>

namespace Lannootree {

  LannooTree::LannooTree() { start(); }

  LannooTree::~LannooTree() {}

  void LannooTree::start(void) {
    log(logo);
    info_log("Starting lannootree firmware");

    info_log("Reading config file...");
    std::ifstream f("../test.json");
    info_log("Success!");

    info_log("Parsing data...");
    config = json::parse(f);
    info_log("Success!");
    
    info_log("Closing file...");
    f.close();

    // Creation of Thread object 
    auto led_task = new LedDriverThread(config, &_color_queue);
    auto socket_task = new SocketThread(&_running, &_color_queue);

    // Passing object to thread giving ownership of the object
    ThreadStarter::add_thread("LedDriver", *led_task);
    ThreadStarter::add_thread("Socket", *socket_task);

    // Removing hollow objects
    delete led_task;
    delete socket_task;

    while (_running) {}
    
    _color_queue.request_shutdown();

    info_log("Waiting for threads to join");
    ThreadStarter::join("LedDriver");
    ThreadStarter::join("Socket");
    info_log("Lannootree gracefully shutting down");
  }

}
