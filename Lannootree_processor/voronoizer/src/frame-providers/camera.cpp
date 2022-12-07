#include <camera.hpp>

namespace Processing {

  Camera::Camera() : Camera(0) { }

  Camera::Camera(int index) {
    m_camera.open(index);

    if (!m_camera.isOpened()) {
      throw std::runtime_error("Failed to open camera");
    }
  }

  cv::Mat& Camera::next_frame(void) {
    m_camera.read(m_frame);
    return m_frame;
  }

}

