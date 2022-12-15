#pragma once

#include <frame-provider.hpp>

namespace Processing {

  class SingelImageProvider : public FrameProvider {

    public:
      SingelImageProvider(std::string image_path);

    public:
      /**
       * @brief 
       * At this moment will return fals after first call of next_frame until multi framed images are supported.
       * 
       * @return true
       * When a frame is available 
       * @return false 
       * When no frames available
       */
      virtual bool has_next_frame(void) { return m_has_next_frame; };

      /**
       * @brief Returns cv::Mat of image
       * 
       * @return cv::Mat& 
       */
      virtual cv::Mat& next_frame(void);

    private:
      bool m_has_next_frame = true;

  };

}
