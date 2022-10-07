#include <fstream>
#include <json.hpp>
#include <queue.hpp>
#include <color.hpp>
#include <thread_starter.hpp>
#include <lannootree_config.hpp>

#include <lannootree.hpp>

using namespace Lannootree;
using json = nlohmann::json;

Queue<Color> queue;
json config;

int main(int argc, char* argv[]) {
  ThreadStarter::add_thread("ConfigParser", [](void* arg) {
    auto json_config = (json*) arg;
    std::ifstream f("../test.json");
    *json_config = json::parse(f);
    f.close();
  }, &config);

  std::cout << config << std::endl;

  ThreadStarter::join("ConfigParser");

  ThreadStarter::add_thread("Socket", [](void* arg) {}, &queue);
  ThreadStarter::add_thread("LedDriver", [](void* arg) {}, &queue);

  ThreadStarter::join_all();

  return 0;
}
