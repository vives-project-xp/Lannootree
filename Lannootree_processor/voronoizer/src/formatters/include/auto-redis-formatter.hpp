#pragma once

#include <formatter.hpp>

#include <json.hpp>
#include <sw/redis++/redis++.h>

namespace Processing {

  class AutoRedisFormatter : public Formatter {

    public:
      AutoRedisFormatter(std::string redis_url);

    public:
      virtual void format(std::vector<uint8_t>& cstring, cv::Mat& frame);

    private:
      std::unique_ptr<sw::redis::Redis> m_redis_client;

  };

}
