add_library(voronoizer-process INTERFACE)

target_include_directories(voronoizer-process INTERFACE
  ${CMAKE_CURRENT_LIST_DIR}/include
)

target_sources(voronoizer-process INTERFACE
  ${CMAKE_CURRENT_LIST_DIR}/voronoizer.cpp
)
  
target_link_libraries(voronoizer-process INTERFACE
  voronoizer-libs
  voronoizer-frame-providers
)
  