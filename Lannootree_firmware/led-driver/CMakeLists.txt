cmake_minimum_required(VERSION 3.13)

project(Lannootree_firmware VERSION 2.0.0)

configure_file(${CMAKE_CURRENT_LIST_DIR}/ProjectFiles/utils/include/lannootree_config.hpp.in ${CMAKE_CURRENT_LIST_DIR}/ProjectFiles/utils/include/lannootree_config.hpp)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_THREAD_PREFER_PTHREAD TRUE)
set(THREADS_PREFER_PTHREAD_FLAG TRUE)

set(BUILD_SHARED ON)
set(BUILD_TEST OFF)

find_package(Threads REQUIRED)

add_subdirectory(${CMAKE_CURRENT_LIST_DIR}/rpi_ws281x)
add_subdirectory(${CMAKE_CURRENT_LIST_DIR}/ProjectFiles)

# option(BUILD_DOC "Build documentation" OFF)

# find_package(Doxygen)
# if (DOXYGEN_FOUND)
#     # set input and output files
#     set(DOXYGEN_IN ${CMAKE_CURRENT_SOURCE_DIR}/docs/Doxygen/Doxyfile.cfg)
#     set(DOXYGEN_OUT ${CMAKE_CURRENT_BINARY_DIR}/Doxyfile)

#     # request to configure the file
#     configure_file(${DOXYGEN_IN} ${DOXYGEN_OUT} @ONLY)
#     message("Doxygen build started")

#     # note the option ALL which allows to build the docs together with the application
#     add_custom_target( doc_doxygen ALL
#         COMMAND ${DOXYGEN_EXECUTABLE} ${DOXYGEN_OUT}
#         WORKING_DIRECTORY ${CMAKE_CURRENT_BINARY_DIR}
#         COMMENT "Generating API documentation with Doxygen"
#         VERBATIM )
# else (DOXYGEN_FOUND)
#   message("Doxygen need to be installed to generate the doxygen documentation")
# endif (DOXYGEN_FOUND)
