#include <auto-redis-formatter.hpp>

namespace Processing {

  AutoRedisFormatter::AutoRedisFormatter(std::string redis_url) {
    m_redis_client = std::make_unique<sw::redis::Redis>(redis_url);
  }

  void AutoRedisFormatter::format(std::vector<uint8_t>& cstring, __attribute_maybe_unused__ cv::Mat& frame) {
    
  }

}

