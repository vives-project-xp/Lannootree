#include <lannootree.hpp>

namespace Lannootree {

  void LannooTree::start(void) {
    log(logo);
    info_log("Starting lannootree firmware");
    info_log("Using config file: ../test.json"); // TODO: find good location for this file
    info_log("Loading config file");

    std::ifstream f("../test.json");
    LannooTree::get().config = json::parse(f);
    f.close();

    LannooTree::get().controller = std::make_shared<LedstripController>(LedstripController(LannooTree::get().config));

    ThreadStarter::add_thread("LedController", , LannooTree::get()._color_queue);

  }

  void LannooTree::add_sig_handlers(void) {
    struct sigaction act;
    memset(&act, '\0', sizeof(act));
    act.sa_sigaction = [](int sig, siginfo_t* siginfo, void* context) {  };
    act.sa_flags = SA_SIGINFO;
    sigaction(SIGTERM, &act, NULL);
    sigaction(SIGINT,  &act, NULL);
    sigaction(SIGKILL, &act, NULL);
  }

}
