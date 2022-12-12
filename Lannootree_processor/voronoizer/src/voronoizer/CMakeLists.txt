add_library(voronoizer-process INTERFACE)

target_include_directories(voronoizer-process INTERFACE
  ${PROJECT_SOURCE_DIR}/src/voronoizer/include 
)


if (USE_CUDA)
  target_sources(voronoizer-process INTERFACE
    ${CMAKE_CURRENT_LIST_DIR}/voronoizer-arguments.cpp
    ${CMAKE_CURRENT_LIST_DIR}/voronoizer.cpp
    ${CMAKE_CURRENT_LIST_DIR}/voronoizer-cuda-processing.cu
  )

  target_link_libraries(voronoizer-process INTERFACE
    voronoizer-libs
    voronoizer-cuda
    voronoizer-formatters
    voronoizer-frame-providers
  )
else()
  target_sources(voronoizer-process INTERFACE
    ${CMAKE_CURRENT_LIST_DIR}/voronoizer-arguments.cpp
    ${CMAKE_CURRENT_LIST_DIR}/voronoizer.cpp
  )

  target_link_libraries(voronoizer-process INTERFACE
    voronoizer-libs
    voronoizer-formatters
    voronoizer-frame-providers
  )
endif()