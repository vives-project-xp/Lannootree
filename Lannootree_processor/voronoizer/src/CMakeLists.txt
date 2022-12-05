add_subdirectory(${CMAKE_CURRENT_LIST_DIR}/frame-providers)
add_subdirectory(${CMAKE_CURRENT_LIST_DIR}/libs)
add_subdirectory(${CMAKE_CURRENT_LIST_DIR}/voronoizer)

add_executable(Voronoizer ${CMAKE_CURRENT_LIST_DIR}/main.cpp)

target_include_directories(Voronoizer PUBLIC
  ${CMAKE_CURRENT_LIST_DIR}/frame-provider/include
  ${CMAKE_CURRENT_LIST_DIR}/libs/include
  ${CMAKE_CURRENT_LIST_DIR}/voronoizer/include
)

target_link_libraries(Voronoizer PUBLIC
  ${OpenCV_LIBS}
  voronoizer-libs
  voronoizer-frame-providers
  voronoizer-process
)
