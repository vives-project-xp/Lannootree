add_library(utils INTERFACE)

target_include_directories(utils INTERFACE 
  ${CMAKE_CURRENT_LIST_DIR}/include
)

target_sources(utils INTERFACE
  ${CMAKE_CURRENT_LIST_DIR}/logger.cpp
  ${CMAKE_CURRENT_LIST_DIR}/led_buffer.cpp
  ${CMAKE_CURRENT_LIST_DIR}/unix_socket.cpp
)
