#include "./include/voroniozer.hpp"

#include <chrono>

namespace Processing {

  Voronoizer::Voronoizer() : Voronoizer(2, 2) { };

  Voronoizer::Voronoizer(uint width, uint height)
    : m_width(width), m_height(height) 
  {
    m_number_of_panels = m_width * m_height;

    double prim_unit_data[] = {
      83.08, 368.57,
      116.65, 353.16,
      154.98, 345.04,
      80.74, 329.51,
      134.55, 314.05,
      62.96, 290.33,
      101.12, 298.58,
      137.07, 275.03
    };

    // Initialize prim_unit matrix
    m_prim_unit = cv::Mat(8, 2, CV_64F, prim_unit_data);

    // Create panel matrix
    m_panel = cv::Mat(9 * m_prim_unit.rows, 2, m_prim_unit.type());
    for (int i = 0; i < 3; i++) {
      for (int j = 0; j < 3; j++) {
        // Calculate offset
        int row_offset = m_prim_unit.rows * (i + j * 3);

        // Create offset data
        double offset_data[2 * m_prim_unit.rows];
        for (int k = 0; k < 2 * m_prim_unit.rows; k += 2) {
          offset_data[k + 0] = i * m_dsubx;
          offset_data[k + 1] = (-j) * m_dsuby;
        }

        // Add prim_unit to offset
        cv::Mat result(m_prim_unit.rows, 2, m_prim_unit.type(), offset_data);
        cv::add(m_prim_unit, result, result);

        // Copy to panel with correct offset
        result.copyTo(m_panel(cv::Rect(0, row_offset, 2, 8)));        
      }
    }

    // Sort the x values
    cv::Mat idx;
    cv::Mat column = m_panel.col(0);
    cv::sortIdx(column, idx, cv::SortFlags::SORT_EVERY_COLUMN + cv::SortFlags::SORT_ASCENDING);
  
    cv::Mat sorted_panel(m_panel.rows, m_panel.cols, m_panel.type());
    for (int y = 0; y < m_panel.rows; y++) {
      m_panel
        .row(idx.at<int>(y))
        .copyTo(sorted_panel.row(y));
    }
  
    // Sort the y values where x values are the same
    for (int row = 0; row < sorted_panel.rows; row += 3) {
      cv::Mat idx;
      cv::Mat group = sorted_panel(cv::Rect(0, row, 2, 3));
      cv::Mat column = group.col(1);
      
      cv::sortIdx(column, idx, cv::SortFlags::SORT_EVERY_COLUMN + cv::SortFlags::SORT_ASCENDING);

      cv::Mat sorted_group(group.rows, group.cols, group.type());
      for (int y = 0; y < group.rows; y++) {
        group
          .row(idx.at<int>(y))
          .copyTo(sorted_group.row(y));
      }

      // Copy back to m_panel
      sorted_group
        .copyTo(m_panel(cv::Rect(0, row, 2, 3)));
    }

    generate_screen();

    // Creation of led indexes
    double panel_led_indexes_data[] = {
      0, 22, 46, 20, 44, 61, 21, 45, 62,  1, 23, 47, 19, 43, 63, 18, 42,
      60,  2, 24, 48, 17, 41, 64,  3, 25, 49, 16, 40, 59, 26, 50, 65,  4,
      39, 58, 15, 38, 66, 14, 37, 57,  5, 27, 51, 13, 36, 67,  6, 28, 56,
      12, 35, 68, 29, 52, 69,  7, 30, 55, 11, 34, 70,  9, 32, 54,  8, 31,
      53, 10, 33, 71
    };

    cv::Mat led_indexes = cv::Mat(1, 72, CV_64F, panel_led_indexes_data);

    m_screen_led_indexes = cv::Mat(1, m_number_of_panels * led_indexes.cols, led_indexes.type(), cv::Scalar(0));
    
    for (int i = 0; i < m_number_of_panels; i++) {
      cv::Mat multiplied = led_indexes.clone();
      cv::multiply(multiplied, i, multiplied);
      cv::add(led_indexes, multiplied, multiplied);

      multiplied
        .copyTo(m_screen_led_indexes(cv::Rect((i * multiplied.cols), 0, multiplied.cols, 1)));
    }
  };

  void Voronoizer::start(uint32_t number_of_workers) {
    uint32_t actual_workers = m_thread_pool.start(number_of_workers);
    std::cout << "Asked for " << number_of_workers << " workers received: " << actual_workers << std::endl;

    cv::Mat frame;
    cv::Mat screen(m_screen.rows, m_screen.cols, m_screen.type());

    while (true) {
      frame = m_frame_provider->next_frame();

      auto start = std::chrono::high_resolution_clock::now();
      scale_screen_to_image(screen, frame);

      // Add points to subdiv
      auto subdiv = cv::Subdiv2D(cv::Rect2d(0, 0, frame.cols, frame.rows));
      for (int row = 0; row < screen.rows; row++) {
        subdiv.insert(
          cv::Point2d(screen.at<double>(row, 0), screen.at<double>(row, 1))
        );
      }

      std::vector<cv::Point2f> centers;
      std::vector<std::vector<cv::Point2f>> facets;
      subdiv.getVoronoiFacetList({}, facets, centers);

      // Convert to gray scale
      cv::Mat gray_image;
      cv::cvtColor(frame, gray_image, cv::COLOR_BGR2GRAY);

      std::vector<std::vector<cv::Vec3i>> colors(actual_workers);

      // Start bunch of workers to calculate color
      for (int i = 0; i < (int) actual_workers; i++) {
        // Loadbalance processing over workers
        int split_size = (int) (facets.size() / actual_workers);

        int from = i * split_size;
        int to   = from + split_size;

        auto color = &colors[i];

        m_thread_pool.queue_job(
          [&facets, &gray_image, &frame, color, from, to] (void) {

            for (int i = from; i < to; i++) {
              auto ifacet = facets[i];

              // Convert to cv::Point
              std::vector<cv::Point> ifacets;
              for (auto point : ifacet) ifacets.push_back(
                cv::Point(point.x, point.y)
              );

              cv::Mat mask(gray_image.rows, gray_image.cols, gray_image.type(), cv::Scalar(0));
              cv::fillConvexPoly(mask, ifacets, cv::Scalar(255));

              std::vector<cv::Point> value_indexes;
              cv::findNonZero(mask, value_indexes);

              double red = 0, green = 0, blue = 0;

              if (value_indexes.size() == 0) break;

              for (auto point : value_indexes) {
                auto color = frame.at<cv::Vec3b>(point);
                red += color[0];
                green += color[1];
                blue += color[2];
              }

              red = red / value_indexes.size();         
              green = green / value_indexes.size();         
              blue = blue / value_indexes.size();   

              int ired = cv::pow(red / 255, 1.4) * 255;
              int igreen = cv::pow(green / 255, 1.4) * 255;
              int iblue = cv::pow(blue / 255, 1.4) * 255;

              color->push_back(
                cv::Vec3i(iblue, igreen, ired)
              );
              
              // Only needed for visualisation
              cv::fillConvexPoly(frame, ifacets, cv::Scalar(ired, igreen, iblue), cv::LINE_AA, 0);
            }
          }
        );
      }

      m_thread_pool.wait_all_running_jobs();

      std::vector<cv::Vec3i> cstring;
      for (auto cv : colors) {
        for (auto co : cv) {
          cstring.push_back(co);
        }
      }

      cv::Mat argsort;
      cv::sortIdx(m_screen_led_indexes, argsort, cv::SORT_EVERY_ROW + cv::SORT_ASCENDING);

      std::vector<uint8_t> next;
      for (int i = 0; i < argsort.cols; i++) {
        auto c = cstring[argsort.at<int>(i)];
        next.push_back((int) c[0]);
        next.push_back((int) c[1]);
        next.push_back((int) c[2]);
      }

      json message;
      message["frame"] = next;
      
      // m_redis_client->lpush("nextframe", message.dump());

      cv::imshow("Processed", frame);

      auto end = std::chrono::high_resolution_clock::now();
      auto duration = std::chrono::duration_cast<std::chrono::milliseconds>(end - start);
      std::cout <<  duration.count()  << "ms" << "\r" << std::flush;
      
      if (cv::waitKey(1) == 113) {
        m_thread_pool.stop();
        break;
      }
    }
  }

  void Voronoizer::set_frame_provider(std::shared_ptr<FrameProvider> provider) {
    m_frame_provider = provider;
  }

  void Voronoizer::generate_screen(void) {
    m_number_of_panels = m_width * m_height;

    m_screen = cv::Mat(m_number_of_panels * m_panel.rows, 2, m_panel.type());

    for (int w = 0; w < m_width; w++) {
      for (int h = 0; h < m_height; h++) {
        // Calculate row offset
        double row_offset = m_panel.rows * (w + h * m_width);

        // Create offset data
        double offset_data[2 * m_panel.rows];
        for (int k = 0; k < 2 * m_panel.rows; k += 2) {
          offset_data[k + 0] = w * m_dx;
          offset_data[k + 1] = (1 - h) * m_dy;
        }

        // Add palel to offset
        cv::Mat result(m_panel.rows, m_panel.cols, m_panel.type(), offset_data);
        cv::add(m_panel, result, result);

        // Copy to screen
        result.copyTo(m_screen(cv::Rect(0, row_offset, m_panel.cols, m_panel.rows)));
      }
    }

    // Get min and max values
    double x_min, y_min, x_max, y_max;

    cv::minMaxLoc(m_screen.col(0), &x_min, &x_max, NULL, NULL);
    cv::minMaxLoc(m_screen.col(1), &y_min, &y_max, NULL, NULL);

    cv::subtract(x_min, m_screen.col(0), m_screen.col(0));
    cv::subtract(y_min, m_screen.col(1), m_screen.col(1));

    m_screen *= -1;
  }

  void Voronoizer::scale_screen_to_image(cv::Mat& new_screen, cv::Mat& image) {
    static int image_rows = 0, image_cols = 0;

    // No need to do calculations when image didn't change size
    if (image_rows == image.rows && image_cols == image.cols) return;

    image_rows = image.rows;
    image_cols = image.cols;

    // Scale screen to image
    double x_max, y_max;
    cv::minMaxLoc(m_screen.col(0), NULL, &x_max, NULL, NULL);
    cv::minMaxLoc(m_screen.col(1), NULL, &y_max, NULL, NULL);

    double scale = cv::min(image_rows / y_max, image_cols / x_max) * 0.9;

    cv::Mat n_screen;
    cv::multiply(scale, m_screen, n_screen);

    // Shift screen
    cv::minMaxLoc(n_screen.col(0), NULL, &x_max, NULL, NULL);
    cv::minMaxLoc(n_screen.col(1), NULL, &y_max, NULL, NULL);

    double xt = cv::abs(x_max - image_cols) / 2;
    double yt = cv::abs(y_max - image_rows) / 2;

    cv::add(xt, n_screen.col(0), n_screen.col(0));
    cv::add(yt, n_screen.col(1), n_screen.col(1));

    n_screen.copyTo(new_screen);
  }

}
