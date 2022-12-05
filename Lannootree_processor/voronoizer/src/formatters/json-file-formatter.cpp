#include "./include/json-file-formatter.hpp"

namespace Processing {

  JSONFileFormatter::JSONFileFormatter(std::string save_path, bool save_preview)
    : m_save_path(save_path), m_save_preview(save_preview) 
  {
    m_json_file.open(m_save_path + "processed.json");
    if (!m_json_file.is_open()) {
      throw std::runtime_error("Could not create file do you have a /saves folder?");
    }
  }

  JSONFileFormatter::~JSONFileFormatter() {
    m_json_file << m_data.dump();
    m_json_file.flush();
    m_json_file.close();
  }

  void JSONFileFormatter::format(std::vector<uint8_t>& cstring, cv::Mat& frame) {
    static uint frame_number = 0;

    if (m_save_preview && !m_video_writer.isOpened()) {
      int ex = -1;
      bool success = m_video_writer.open(m_save_path + "processed000.avi", (int) cv::CAP_ANY, cv::VideoWriter::fourcc('M', 'J', 'P', 'G'), (double) 30, frame.size(), true);
      if (!success) {
        std::cerr << "Failed to create videowriter" << std::endl;
      }
    }

    size_t n = 5;
    int precision = n - std::min(n, std::to_string(frame_number++).size());
    std::string s = std::string(precision, '0').append(std::to_string(frame_number));

    m_data[s] = cstring;

    if (m_save_preview) {
      if (frame.empty()) {
        std::cout << "Frame empty" << std::endl;
      } else {
        
        cv::imwrite(m_save_path + "processed.jpg", frame);
        if (m_video_writer.isOpened()) {
          m_video_writer << frame;
        }
      }
    }
  }

}
