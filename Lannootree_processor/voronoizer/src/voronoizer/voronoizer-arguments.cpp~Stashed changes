#include <voronoizer-aruments.hpp>

namespace Processing {

  VoronoizerArguments::VoronoizerArguments(int argc, char* argv[]) 
    : m_arguments("Voronoizer", VORONOIZER_VERSION)
  {
    m_arguments
      .add_argument("-t", "--threads")
      .help("Sets the number of theads to use")
      .default_value(4)
      .scan<'i', int>();
      
    auto provider_help = [&]() {
      std::stringstream ss;
      ss << "Sets the frame provider to use can be: [ ";
      for (auto& [provider, unused] : m_frame_providers_map) {
        ss << '"' << provider << '"' << " ";
      }
      ss << "]";
      return ss.str();
    };

    m_arguments
      .add_argument("-p", "--frame-provider")
      .help(provider_help())
      .required();
      
    m_arguments
      .add_argument("--redis-url")
      .help("redis url to use when frame provider is redis")
      .default_value(std::string{"redis://localhost:6379"});

    m_arguments
      .add_argument("--image")
      .help("Path to image to process");

    m_arguments
      .add_argument("--config")
      .help("Path to config.json file")
      .default_value(std::string{"./config.json"});

    try {
      m_arguments.parse_args(argc, argv);
    } 
    catch(std::runtime_error& err) {
      std::cerr << err.what() << std::endl;
      std::cerr << m_arguments;
      std::exit(1);
    }
  }
    
  int VoronoizerArguments::get_thread_count(void) {
    return m_arguments.get<int>("-t");
  }

  std::shared_ptr<FrameProvider> VoronoizerArguments::get_frame_provider(void) {
    std::shared_ptr<Processing::FrameProvider> provider;
    auto frame_provider = m_arguments.get<std::string>("--frame-provider");

    try {
      switch (m_frame_providers_map[frame_provider]) {
        case FrameProviders::INVALID: {
          std::cerr 
            << "[ " << frame_provider << " ] " 
            << "Invalid frame provider."
            << m_arguments 
            << std::endl;

          std::exit(1);
        }

        case FrameProviders::Camera: {
          provider = std::make_shared<Processing::Camera>();
          break;
        }
        
        case FrameProviders::Redis: {
          auto redis_url = m_arguments.get<std::string>("--redis-url");
          provider = std::make_shared<Processing::RedisFrameProvider>(redis_url);
          break;
        }

        case FrameProviders::SingleImage: {
          auto image_path = m_arguments.get<std::string>("--image");
          provider = std::make_shared<Processing::SingelImageProvider>(image_path);
          break;
        }

        case FrameProviders::Video: {
          provider = std::make_shared<Processing::VideoFrameProvider>("./big_bunny.avi");
          break;
        }
      }
    }
    catch (std::runtime_error& e) {
      std::cerr << e.what() << std::endl;
      std::exit(1);
    }

    return provider;
  }

}
