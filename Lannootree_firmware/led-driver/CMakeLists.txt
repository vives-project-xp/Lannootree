cmake_minimum_required(VERSION 3.13)

project(Lannootree_firmware VERSION 1.2)

configure_file(${CMAKE_CURRENT_LIST_DIR}/ProjectFiles/utils/include/lannootree_config.hpp.in ${CMAKE_CURRENT_LIST_DIR}/ProjectFiles/utils/include/lannootree_config.hpp)

set(CMAKE_CXX_STANDARD 20)
set(CMAKE_THREAD_PREFER_PTHREAD TRUE)
set(THREADS_PREFER_PTHREAD_FLAG TRUE)

set(BUILD_SHARED ON)
set(BUILD_TEST OFF)

find_package(Threads REQUIRED)

add_subdirectory(${CMAKE_CURRENT_LIST_DIR}/rpi_ws281x)
add_subdirectory(${CMAKE_CURRENT_LIST_DIR}/ProjectFiles)