#pragma once

#include <camera.hpp>
#include <version.hpp>
#include <frame-provider.hpp>
#include <redis-frame-provider.hpp>
#include <single-image-provider.hpp>

#include <argparser.hpp>

#include <map>
#include <memory>

namespace Processing {

  class VoronoizerArguments {

    public:
      VoronoizerArguments(int argc, char* argv[]);

    public:
      int get_thread_count(void);
      std::shared_ptr<FrameProvider> get_frame_provider(void);

    private:
      enum class FrameProviders {
        INVALID,
        Camera,
        Redis,
        SingleImage
      };

      std::map<std::string, FrameProviders> m_frame_providers_map {
        { std::string{ "camera" }, FrameProviders::Camera },
        { std::string{ "redis" },  FrameProviders::Redis  },
        { std::string{ "single-image" }, FrameProviders::SingleImage }
      };

    private:
      argparse::ArgumentParser m_arguments;

  };

}
