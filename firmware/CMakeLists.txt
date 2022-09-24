cmake_minimum_required(VERSION 3.13)

project(Lannootree_firmware VERSION 1.0)

# Uncomment to disable warnings
# add_compile_options(-w)

SET(CMAKE_EXE_LINKER_FLAGS "${CMAKE_EXE_LINKER_FLAGS} -pthread")

add_subdirectory(${CMAKE_CURRENT_LIST_DIR}/rpi_ws281x)
add_subdirectory(${CMAKE_CURRENT_LIST_DIR}/ProjectFiles)
