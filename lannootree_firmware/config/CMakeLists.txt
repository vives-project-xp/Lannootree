add_library(NeoPixel INTERFACE)

target_include_directories(NeoPixel INTERFACE
  ${CMAKE_CURRENT_LIST_DIR}
)

target_sources(NeoPixel INTERFACE
  ${CMAKE_CURRENT_LIST_DIR}/ws2812-rpi.cpp
)
