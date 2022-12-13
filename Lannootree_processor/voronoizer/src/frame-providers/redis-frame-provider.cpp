#include <redis-frame-provider.hpp>

namespace Processing {

  RedisFrameProvider::RedisFrameProvider(std::string redis_url) {
    m_redis_client = std::make_unique<sw::redis::Redis>(redis_url);
  }

  cv::Mat& RedisFrameProvider::next_frame(void) {
    auto redis_frame = m_redis_client->brpop("voronoi");
    std::vector<char> data(redis_frame->second.data(), redis_frame->second.data() + redis_frame->second.size() + 1);

    m_frame = cv::imdecode(cv::Mat(data), cv::ImreadModes::IMREAD_ANYCOLOR);

    return m_frame;
  }

}
