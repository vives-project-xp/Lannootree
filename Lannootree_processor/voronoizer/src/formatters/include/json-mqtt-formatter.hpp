#include <formatter.hpp>

#include <json.hpp>
#include <mqtt/async_client.h>

#include <fstream>

using ordered_json = nlohmann::ordered_json;

namespace Processing {

  #ifdef WITH_JSON_MQTT
  /**
   * @brief 
   * Formatter implementation that formats to json and send it over mqtt (used for live streaming)
   * 
   */
  class JSONMqttFormatter : public Formatter {

    public:
      JSONMqttFormatter(std::string topic);

    public:
      virtual void format(std::vector<uint8_t>& cstring, cv::Mat& frame);

    private:
      ordered_json m_data;      

  };
  #endif

}
