add_library(voronoizer-frame-providers INTERFACE)

target_include_directories(voronoizer-frame-providers INTERFACE
  ${CMAKE_CURRENT_LIST_DIR}/include
)

target_sources(voronoizer-frame-providers INTERFACE
  ${CMAKE_CURRENT_LIST_DIR}/camera.cpp
  ${CMAKE_CURRENT_LIST_DIR}/redis-frame-provider.cpp
  ${CMAKE_CURRENT_LIST_DIR}/single-image-provider.cpp
)

target_link_libraries(voronoizer-frame-providers INTERFACE
  ${OpenCV_LIBS}
  redis++::redis++_static
)
