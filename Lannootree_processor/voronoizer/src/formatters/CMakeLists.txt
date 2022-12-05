add_library(voronoizer-formatters INTERFACE)

target_include_directories(voronoizer-formatters INTERFACE
  ${CMAKE_CURRENT_LIST_DIR}/include
)

target_sources(voronoizer-formatters INTERFACE
  ${CMAKE_CURRENT_LIST_DIR}/json-file-formatter.cpp
)

target_link_libraries(voronoizer-formatters INTERFACE
  voronoizer-libs
)
