#pragma once

#include <opencv4/opencv2/opencv.hpp>

namespace Processing {

  /**
   * @brief 
   * Interface class use to create different formaters used to format the processed data from voronoizer
   * 
   */
  class Formatter {

    public:
      /**
       * @brief 
       * Method called after frame has been processed 
       * 
       * @param cstring 
       * Vetor reference to processed data
       * 
       * @param frame
       * Mat reference to processed frame
       */
      virtual void format(std::vector<uint8_t>& cstring, cv::Mat& frame) = 0;

  };

}
