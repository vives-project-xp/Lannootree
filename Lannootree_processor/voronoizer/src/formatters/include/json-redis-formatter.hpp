#pragma once

#include <formatter.hpp>

#include <json.hpp>
#include <sw/redis++/redis++.h>

using json = nlohmann::json;

namespace Processing {

  /**
   * @brief 
   * Formatter implementation that places each processed frame in redis database as json
   * 
   */
  class JsonRedisFormatter : public  Formatter {

    public:
      JsonRedisFormatter(std::string redis_url);

    public:
      virtual void format(std::vector<uint8_t>& cstring, cv::Mat& frame);

    private:
      std::unique_ptr<sw::redis::Redis> m_redis_client;

  };

}
