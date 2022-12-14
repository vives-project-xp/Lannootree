#pragma once

#include <camera.hpp>
#include <version.hpp>

#include <frame-provider.hpp>
#include <redis-frame-provider.hpp>
#include <single-image-provider.hpp>
// #include <video-frame-provider.hpp>

#include <formatter.hpp>
#include <json-file-formatter.hpp>
#include <json-redis-formatter.hpp>

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
      std::shared_ptr<Formatter> get_formatter(void);

    private:
      enum class FrameProviders {
        INVALID,
        Camera,
        Redis,
        SingleImage,
        Video
      };

      enum class Formatters {
        INVALID,
        JSONLocalFile,
        JSONRedis,
      };

      std::map<std::string, FrameProviders> m_frame_providers_map {
        { std::string{ "camera" }, FrameProviders::Camera },
        { std::string{ "redis" },  FrameProviders::Redis  },
        { std::string{ "single-image" }, FrameProviders::SingleImage },
        { std::string{ "video" }, FrameProviders::Video },
      };

      std::map<std::string, Formatters> m_formatters_map {
        { std::string{ "Json-local" }, Formatters::JSONLocalFile },
        { std::string{ "Json-redis" }, Formatters::JSONRedis },
      };

    private:
      argparse::ArgumentParser m_arguments;

  };

}
