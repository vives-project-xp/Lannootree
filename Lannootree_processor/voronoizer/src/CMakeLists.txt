include_directories(
  ${PROJECT_SOURCE_DIR}/src/voronoizer/include 
  ${PROJECT_SOURCE_DIR}/src/libs/include 
  ${PROJECT_SOURCE_DIR}/src/frame-providers/include 
  ${PROJECT_SOURCE_DIR}/src/formatters/include
)

add_subdirectory(${CMAKE_CURRENT_LIST_DIR}/formatters)
add_subdirectory(${CMAKE_CURRENT_LIST_DIR}/frame-providers)
add_subdirectory(${CMAKE_CURRENT_LIST_DIR}/libs)
add_subdirectory(${CMAKE_CURRENT_LIST_DIR}/voronoizer)

if(USE_CUDA)
  add_subdirectory(${CMAKE_CURRENT_LIST_DIR}/cuda-kernels)
endif()

add_executable(Voronoizer ${CMAKE_CURRENT_LIST_DIR}/main.cpp)

target_include_directories(Voronoizer PUBLIC
  ${PROJECT_SOURCE_DIR}/src/voronoizer/include 
  ${PROJECT_SOURCE_DIR}/src/libs/include 
  ${PROJECT_SOURCE_DIR}/src/frame-providers/include 
  ${PROJECT_SOURCE_DIR}/src/formatters/include
)

target_link_libraries(Voronoizer PUBLIC
  ${OpenCV_LIBS}
  voronoizer-libs
  voronoizer-process
  voronoizer-formatters
  voronoizer-frame-providers
)
