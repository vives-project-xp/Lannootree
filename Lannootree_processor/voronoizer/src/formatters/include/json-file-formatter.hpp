#pragma once

#include <formatter.hpp>

#include <json.hpp>
#include <opencv4/opencv2/videoio.hpp>

#include <fstream>

using ordered_json = nlohmann::ordered_json;

namespace Processing {

  /**
   * @brief 
   * A formatter implementation uses to save frames in json format
   * 
   */
  class JSONFileFormatter : public Formatter {

    public:
      /**
       * @brief Construct a new JSONFileFormatter object
       * 
       * @param save_path 
       * Path to save Json and preview
       * @param save_preview 
       * True if you want to save preview false you only want to save json
       */
      JSONFileFormatter(std::string save_path, bool save_preview = false);
      ~JSONFileFormatter();

    public:
      virtual void format(std::vector<uint8_t>& cstring, cv::Mat& frame);

    private:
      ordered_json m_data;
      bool m_save_preview;
      std::ofstream m_json_file;
      std::string m_save_path;
      cv::VideoWriter m_video_writer;

  };

}
