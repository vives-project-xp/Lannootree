#include <redis-frame-provider.hpp>

#include <netdb.h>
#include <arpa/inet.h>

namespace Processing {

  RedisFrameProvider::RedisFrameProvider(std::string redis_url) {
    struct hostent *he;
    const char host[] = "redis";
    he = gethostbyname(host);

    if (he == NULL)
    {
      switch (h_errno)
      {
        case HOST_NOT_FOUND:
          fputs ("The host was not found.\n", stderr);
          break;
        case NO_ADDRESS:
          fputs ("The name is valid but it has no address.\n", stderr);
          break;
        case NO_RECOVERY:
          fputs ("A non-recoverable name server error occurred.\n", stderr);
          break;
        case TRY_AGAIN:
          fputs ("The name server is temporarily unavailable.", stderr);
          break;
      }
    } else {
      auto ip = inet_ntoa (*((struct in_addr *) he->h_addr_list[0]));

      std::string sip(ip);

      std::string url = "redis://" + sip + ":6379";

      m_redis_client = std::make_unique<sw::redis::Redis>(url);
    }
  }

  cv::Mat& RedisFrameProvider::next_frame(void) {
    auto redis_frame = m_redis_client->brpop("voronoi");
    std::vector<char> data(redis_frame->second.data(), redis_frame->second.data() + redis_frame->second.size() + 1);

    m_frame = cv::imdecode(cv::Mat(data), cv::ImreadModes::IMREAD_ANYCOLOR);

    return m_frame;
  }

}
