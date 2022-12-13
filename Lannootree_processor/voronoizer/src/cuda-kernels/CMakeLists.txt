add_library(voronoizer-cuda INTERFACE)

if (USE_CUDA)

target_sources(voronoizer-cuda INTERFACE
  ${CMAKE_CURRENT_LIST_DIR}/mean-masked.cu
)

target_include_directories(voronoizer-cuda INTERFACE
  ${CMAKE_CURRENT_LIST_DIR}/include
  ${CUDA_INCLUDE_DIRS}
)

endif()
