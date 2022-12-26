#include <json-redis-formatter.hpp>

#include <netdb.h>
#include <arpa/inet.h>

namespace Processing {

  JsonRedisFormatter::JsonRedisFormatter(std::string redis_url) {
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

  void JsonRedisFormatter::format(std::vector<uint8_t>& cstring, __attribute_maybe_unused__ cv::Mat& frame) {
    json next_frame;
    next_frame["frame"] = cstring;

    m_redis_client->lpush("processed", next_frame.dump());
  } 

}
