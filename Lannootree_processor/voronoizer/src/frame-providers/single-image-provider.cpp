#include "./include/single-image-provider.hpp"


static bool endsWith(std::string_view str, std::string_view suffix) {
  return str.size() >= suffix.size() && 0 == str.compare(str.size()-suffix.size(), suffix.size(), suffix);
}

namespace Processing {

  SingelImageProvider::SingelImageProvider(std::string image_path) {
    if (!(endsWith(image_path, ".jpg") || endsWith(image_path, ".png"))) {
      throw std::runtime_error("Non inmplemted filetype current supported types are [ .jpg, .png ]");
    }

    m_frame = cv::imread(image_path);
  }

  cv::Mat& SingelImageProvider::next_frame(void) {
    m_has_next_frame = false;
    return m_frame;
  }

}
