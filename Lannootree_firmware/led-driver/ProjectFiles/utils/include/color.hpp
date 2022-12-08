#pragma once

#include <string>
#include <iostream>
#include <stdint.h>

namespace Lannootree {

  struct color {
    union {
      uint8_t data[4] __attribute__((aligned(4)));
      uint32_t wrgb;
    };
  };

  /**
   * @brief A color abstratction class to wrap rgb values.
   */
  class Color {
    
    public:
      Color() {};
      Color(uint8_t red, uint8_t green, uint8_t blue) {
        m_color[1] = red;
        m_color[2] = green;
        m_color[3] = blue;
      };
      
      ~Color() {};

    public:
      /**
       * @brief Returns uint32_t reprensentation of color.
       * 
       * In color format RGB, where each byte represents the respective color.
       *
       */
      uint32_t to_uint32_t(void) {
        return *(uint32_t*)&m_color;
        // return 0U | ((uint32_t)(m_color[0] << 24) | (uint32_t)(m_color[1] << 16) | (uint32_t)(m_color[2] << 8) | (uint32_t)m_color[3]);
      }

      /**
       * @brief Helper function to convert uint32_t to Color class
       * 
       * @return Color 
       */
      static Color uint32_to_color(uint32_t val) {
        uint8_t r, g, b;
        r = (val >> 16) & 0xff;
        g = (val >> 8) & 0xff;
        b = (val) & 0xff;

        return Color(r, g, b);
      }

    public:
      friend std::ostream& operator<<(std::ostream& os, const Color& c) {
        os << "RGB(" << std::to_string(c.m_color[1]) << ", " << std::to_string(c.m_color[2]) << ", " << std::to_string(c.m_color[3]) << ")";
        return os;
      }

    private:
      uint8_t m_color[4] = {0};

  };
}
