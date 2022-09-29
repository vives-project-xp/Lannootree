add_library(communication INTERFACE)

target_include_directories(communication INTERFACE
  ${CMAKE_CURRENT_LIST_DIR}/include
)

target_sources(communication INTERFACE
  ${CMAKE_CURRENT_LIST_DIR}/socket.cpp
)
