#include <lannootree.hpp>

namespace Lannootree {

  LannooTree::LannooTree() { start(); }

  LannooTree::~LannooTree() { }

  void LannooTree::start(void) {
    log(logo);
    info_log("Starting lannootree firmware");

    auto handel = [](int signum) {
      std::lock_guard lck(mtx);
      shutdown_request.notify_all();
    };

    signal(SIGINT, handel);
    signal(SIGTERM, handel);

    info_log("Reading config file...");
    std::ifstream f(JSON_FILE_PATH);
    config = json::parse(f);
    info_log("Cleaning up...");
    f.close();

    info_log("Creating threads...");
    // Pass in thread object to thread starter, thread starter will delete heap memory
    ThreadStarter::add_thread("LedDriver", new LedDriverThread(config, &_color_queue));
    ThreadStarter::add_thread("Socket", new SocketThread(&_running, &_color_queue));

    std::unique_lock lock(mtx);
    shutdown_request.wait(lock);

    _running = false;
    
    info_log("Requesting shutdown...");
    // Notify threads blocking on queue program is shutting down
    _color_queue.request_shutdown();

    info_log("Waiting for threads to join...");
    ThreadStarter::join_all();
    info_log("Lannootree gracefully shut down");
  }

}
