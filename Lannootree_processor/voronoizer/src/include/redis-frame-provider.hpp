#pragma once

#include "./frame-provider.hpp"
#include <sw/redis++/redis++.h>

namespace Processing {

  class RedisFrameProvider : public FrameProvider {

    public:
      RedisFrameProvider(std::string redis_url);

    public:
      /**
       * @brief
       * Decodes image poped from redis database
       * Note: You should check if frame is not empty
       * 
       * @return cv::Mat& 
       */
      virtual cv::Mat& next_frame(void);

    private:
      cv::Mat m_frame;
      std::unique_ptr<sw::redis::Redis> m_redis_client;


  };

}
