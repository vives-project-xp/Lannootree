add_library(controll INTERFACE)

target_include_directories(controll INTERFACE
  ${CMAKE_CURRENT_LIST_DIR}/include/
)

target_sources(controll INTERFACE
  ${CMAKE_CURRENT_LIST_DIR}/ledstrip_controller.cpp
)

target_link_libraries(controll INTERFACE
  ws2811
)
