#include <iostream>

#include <argparser.hpp>
#include <voroniozer.hpp>

#include <json-file-formatter.hpp>
#include <json-mqtt-formatter.hpp>

#include <camera.hpp>
#include <redis-frame-provider.hpp>
#include <single-image-provider.hpp>

enum class FrameProviders {
  INVALID,
  Camera,
  Redis,
  SingleImage
};

static std::map<std::string, FrameProviders> frame_providers_map {
  { std::string{ "camera" }, FrameProviders::Camera },
  { std::string{ "redis" },  FrameProviders::Redis  },
  { std::string{ "single-image" }, FrameProviders::SingleImage }
};

int main(int argc, char* argv[]) {
  // TODO: [Clean] -> Maby move arg parsing somwhere else to clean up main
  argparse::ArgumentParser arguments("Voronoizer", "1.0.2");

  arguments
    .add_argument("-t", "--threads")
    .help("set number of threads to use")
    .scan<'i', int>()
    .default_value(4);

  arguments 
    .add_argument("-w", "--width")
    .help("width to use")
    .scan<'i', int>()
    .default_value(2);

  arguments 
    .add_argument("-h", "--height")
    .help("height to use")
    .scan<'i', int>()
    .default_value(2);

  arguments
    .add_argument("--frame-provider")
    .required()
    .help("frame provider to use can be [ redis, camera, single-image ]");

  arguments
    .add_argument("--redis-url")
    .help("redis url to use when frame provider is redis")
    .default_value(std::string{"redis://localhost:6379"});

  arguments
    .add_argument("-i", "--image")
    .help("Path to image to process");

  arguments
    .add_argument("--config")
    .help("Path to config.json file")
    .default_value(std::string{"./config.json"});

  try {
    arguments.parse_args(argc, argv);
  } 
  catch (std::runtime_error& err) {
    std::cerr << err.what() << std::endl;
    std::cerr << arguments;
    std::exit(1);
  }

  auto threads = arguments.get<int>("-t");
  auto width = arguments.get<int>("-w");
  auto height = arguments.get<int>("-h");

  auto frame_provider = arguments.get<std::string>("--frame-provider");

  // Get the frame provider
  std::shared_ptr<Processing::FrameProvider> provider;
  std::shared_ptr<Processing::Formatter> formatter;

  try {
    switch (frame_providers_map[frame_provider]) {
      case FrameProviders::INVALID: {
        std::cerr 
          << "[ " << frame_provider << " ] " 
          << "Invalid frame provider.\nProvider can be [ redis, camera, single-image ]" 
          << std::endl;

        std::exit(1);
      }

      case FrameProviders::Camera: {
        provider = std::make_shared<Processing::Camera>();
        break;
      }
      
      case FrameProviders::Redis: {
        auto redis_url = arguments.get<std::string>("--redis-url");
        provider = std::make_shared<Processing::RedisFrameProvider>(redis_url);
        break;
      }

      case FrameProviders::SingleImage: {
        auto image_path = arguments.get<std::string>("-i");
        provider = std::make_shared<Processing::SingelImageProvider>(image_path);
        break;
      }
    }
  }
  catch (std::runtime_error& e) {
    std::cerr << e.what() << std::endl;
    std::exit(1);
  }

  formatter = std::make_shared<Processing::JSONFileFormatter>("./saves/", true);

  #ifdef WITH_JSON_MQTT
    formatter = std::make_shared<Processing::JSONMqttFormatter>("/test");
  #endif

  auto config_path = arguments.get<std::string>("--config");

  Processing::Voronoizer voroizer(width, height, provider, formatter, config_path);
  voroizer.start(threads);

  return 0;
}
