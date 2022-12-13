#include <voroniozer.hpp>
#include <voronoizer-aruments.hpp>

#include <json-redis-formatter.hpp>

int main(int argc, char* argv[]) {
  Processing::VoronoizerArguments args(argc, argv);
  
  std::shared_ptr<Processing::Formatter> formatter;
  formatter = std::make_shared<Processing::JSONFileFormatter>("./saves/", true);
  // formatter = std::make_shared<Processing::JsonRedisFormatter>("redis://localhost:6379");

  Processing::Voronoizer voroizer(args.get_frame_provider(), formatter, "./config.json");
  voroizer.start(args.get_thread_count());
  
  // #ifdef WITH_JSON_MQTT
  //   formatter = std::make_shared<Processing::JSONMqttFormatter>("/test");
  // #endif
  // auto config_path = arguments.get<std::string>("--config");

  return 0;
}