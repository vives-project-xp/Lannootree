#pragma once

#include <opencv4/opencv2/opencv.hpp>

namespace Processing {

  /**
   * @brief 
   * Interface class use to create frame providers for the voronoizer
   * 
   */
  class FrameProvider {

    public:
      /**
       * @brief 
       * Method to let voronoizer know if there are more frames to come
       * 
       * @return true 
       * When more frames will come
       * @return false 
       * When all frames have been processed and program can shut down
       */
      virtual bool has_next_frame(void) = 0;

      /**
       * @brief 
       * Here you should get the frame you want to process and place it in m_frame and then return m_frame
       * 
       * @return cv::Mat& 
       */
      virtual cv::Mat& next_frame(void) = 0;     

    protected:
      cv::Mat m_frame;

  };

}
