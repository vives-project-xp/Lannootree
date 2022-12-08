#pragma once

#include <frame-provider.hpp>

namespace Processing {

  class Camera : public FrameProvider {

    public:
      Camera ();
      Camera (int index);

    public:
      /**
       * @brief Camera always has next frame
       * 
       * @return true 
       */
      virtual bool has_next_frame(void) { return true; };

      /**
       * @brief Returns next frame from camera
       * 
       * @return cv::Mat& 
       */
      virtual cv::Mat& next_frame(void);

    private:
      cv::VideoCapture m_camera;

  };

}
