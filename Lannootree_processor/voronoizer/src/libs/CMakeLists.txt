add_library(voronoizer-libs INTERFACE)

target_include_directories(voronoizer-libs INTERFACE
  ${CMAKE_CURRENT_LIST_DIR}/include
)

target_sources(voronoizer-libs INTERFACE
  ${CMAKE_CURRENT_LIST_DIR}/threadpool.cpp
)
