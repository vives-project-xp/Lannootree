#include <iostream>

#include "./include/argparser.hpp"
#include "./include/voroniozer.hpp"
#include "./include/frame-provider.hpp"
#include "./include/camera.hpp"
#include "./include/redis-frame-provider.hpp"

int main(int argc, char* argv[]) {
  argparse::ArgumentParser arguments("Voronoizer", "1.0.1");

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
    .help("frame provider to use can be redis or camera");

  arguments
    .add_argument("--redis-url")
    .help("redis url to use when frame provider is redis")
    .default_value(std::string{"redis://localhost:6379"});

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

  if (frame_provider == "redis") {
    auto redis_url = arguments.get<std::string>("--redis-url");
    provider = std::make_shared<Processing::RedisFrameProvider>(redis_url);
  } 

  else if (frame_provider == "camera") {
    try {
      provider = std::make_shared<Processing::Camera>();
    } 
    catch (std::runtime_error& e) {
      std::cerr << e.what() << std::endl;
      std::exit(1);
    }
  }

  else {
    std::cerr << "Invalid frame provider.\nProvider can be redis or camera" << std::endl;
    std::exit(1);
  }

  Processing::Voronoizer voroizer(width, height);
  voroizer.set_frame_provider(provider);

  voroizer.start(threads);

  return 0;
}
