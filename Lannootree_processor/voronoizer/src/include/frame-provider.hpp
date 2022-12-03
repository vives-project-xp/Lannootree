#pragma once

#include <opencv4/opencv2/opencv.hpp>

namespace Processing {

  class FrameProvider {

    public:
      virtual cv::Mat& next_frame(void) = 0;     

    protected:
      cv::Mat m_frame;

  };

}
