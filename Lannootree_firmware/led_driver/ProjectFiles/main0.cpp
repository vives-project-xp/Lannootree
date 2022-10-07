#include <fstream>
#include <json.hpp>
#include <lannootree_config.hpp>
#include <ledstrip_controller.hpp>

using json = nlohmann::json;
uint8_t running = 1;

static void add_sig_handels(void) {
  struct sigaction act;
  memset(&act, '\0', sizeof(act));
  act.sa_sigaction = [](int sig, siginfo_t* siginfo, void* context) { running = 0; };
  act.sa_flags = SA_SIGINFO;
  sigaction(SIGTERM, &act, NULL);
  sigaction(SIGINT,  &act, NULL);
  sigaction(SIGKILL, &act, NULL);
}

int main(int argc, char** argv) {
  add_sig_handels();
  std::cout << logo << std::endl;

  if (argc < 2) {
    error_log("No config file specified");
    log("Usage: " << argv[0] << " <config_file>");
    return 1;
  }

  info_log("Starting lannootree firmware");
  info_log("Using config file: " << argv[1]);
  info_log("Loading config file");
  
  std::ifstream config_file(argv[1]);
  if (!config_file.is_open()) {
    error_log("Failed to open config file" << argv[1]);
    return 1;
  }

  json config = json::parse(config_file);
  config_file.close();

  info_log("Config file loaded");

  // Todo: Initialize ledstrips by config
  // ledstrip_controller = std::shared_ptr<LedstripController>(new LedstripController(config));

  //!--------- Remove just for testing ---------!//
  Lannootree::LedstripController cnt(config);
  //!-------------------------------------------!//

  // Todo: initialize redis client
  // Take in config to set up redis client
  // redis_client = std::shared_ptr<RedisClient>(new RedisClient(config));

  while (running) {
    // redis_client->update();
    // ledstrip_controller->update();
  }

  // Todo: cleanup
  
  info_log("Shutting down lannootree firmware");
  if (config_file.is_open()) {
    config_file.close();
  }

  return 0;
}
