add_library(lannootree INTERFACE)

target_include_directories(lannootree INTERFACE
  ${CMAKE_CURRENT_LIST_DIR}/include
)

target_sources(lannootree INTERFACE
  ${CMAKE_CURRENT_LIST_DIR}/lannootree.cpp
  ${CMAKE_CURRENT_LIST_DIR}/led_driver_thread.cpp
  ${CMAKE_CURRENT_LIST_DIR}/unix_socket.cpp
)

