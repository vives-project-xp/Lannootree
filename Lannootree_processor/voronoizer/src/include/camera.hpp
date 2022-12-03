#pragma once

#include "./frame-provider.hpp"

namespace Processing {

  class Camera : public FrameProvider {

    public:
      Camera ();
      Camera (int index);

    public:
      virtual cv::Mat& next_frame(void);

    private:
      cv::VideoCapture m_camera;

  };

}
