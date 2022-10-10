#pragma once

#include <stdint.h>

namespace Lannootree {

  class Color {
    
    public:
      Color() : Color(0, 0, 0) {};
      Color(uint8_t red, uint8_t green, uint8_t blue)
        : red(red), green(green), blue(blue) {};
      
      ~Color() {};

    public:
      /**
       * @brief Returns uint32_t reprensentation of color.
       * 
       * In color format RGB, where each byte represents the respective color.
       *
       */
      uint32_t to_uint32_t(void) {
        return 0U | ((uint32_t) red) << 16 | ((uint32_t) green) << 8 | ((uint32_t) blue);
      }

    private:
      uint8_t red;
      uint8_t green;
      uint8_t blue;

  };
  

}