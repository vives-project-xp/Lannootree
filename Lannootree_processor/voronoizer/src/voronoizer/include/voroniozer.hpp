#pragma once

#include <threadpool.hpp>
#include <frame-provider.hpp>
#include <json-file-formatter.hpp>

#include <opencv4/opencv2/opencv.hpp>

#include <mutex>
#include <memory>
#include <iostream>

namespace Processing {

  class Voronoizer {

    public:
      Voronoizer (std::shared_ptr<FrameProvider> provider, std::shared_ptr<Formatter> fromatter);
      Voronoizer (int width, int height, std::shared_ptr<FrameProvider> provider, std::shared_ptr<Formatter> fromatter);

    public:
      void start(uint32_t number_of_workers);

    private:
      void generate_screen(void);
      void scale_screen_to_image(cv::Mat& new_screen, cv::Mat& image);

    private:
      uint m_width;
      uint m_height;
      uint m_number_of_panels;

    private:
      Threading::ThreadPool m_thread_pool;
      std::shared_ptr<Formatter> m_fromatter;
      std::shared_ptr<FrameProvider> m_frame_provider;

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
