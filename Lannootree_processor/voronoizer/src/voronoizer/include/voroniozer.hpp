#pragma once

#include <threadpool.hpp>
#include <formatter.hpp>
#include <frame-provider.hpp>

#include <json.hpp>
#include <opencv4/opencv2/core/core.hpp>
#include <opencv4/opencv2/core/cuda.hpp>
#include <opencv4/opencv2/opencv.hpp>

#include <map>
#include <mutex>
#include <memory>
#include <fstream>
#include <iostream>

#ifdef USE_CUDA
  #include <voronoizer-cuda-processing.hpp>
#endif

using channel_coodinates = std::vector<std::tuple<int, int>>;

namespace Processing {

  class Voronoizer {

    public:
      Voronoizer (std::shared_ptr<FrameProvider> provider, std::shared_ptr<Formatter> fromatter, const std::string& config_path);

    public:
      void start(uint32_t number_of_workers);

    private:
      void generate_screen(void);
      void configure_json(const std::string& json_path);
      bool scale_screen_to_image(cv::Mat& new_screen, cv::Mat& image);

    private:
      uint m_width;
      uint m_height;
      uint m_number_of_panels;

    private:
      Threading::ThreadPool m_thread_pool;
      std::shared_ptr<Formatter> m_fromatter;
      std::shared_ptr<FrameProvider> m_frame_provider;

    private:
      std::map<std::string, channel_coodinates> m_channel_map;

    private:
      cv::Mat m_prim_unit;
      cv::Mat m_panel;
      cv::Mat m_screen;
      cv::Mat m_screen_led_indexes;
    
    private:
      const double m_dsubx = 107.76;
      const double m_dsuby = 109.03;
      const double m_dx = 3 * m_dsubx;
      const double m_dy = 3 * m_dsuby;

  };

}
