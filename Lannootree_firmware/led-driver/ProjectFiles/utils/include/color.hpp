#pragma once

#include <string>
#include <iostream>
#include <stdint.h>

namespace Lannootree {

  /**
   * @brief 
   * Color abstraction
   * 
   */
  struct Color {
    union {
      uint8_t data[4] __attribute__((aligned(4)));
      uint32_t wrgb;
    };
  };

}
