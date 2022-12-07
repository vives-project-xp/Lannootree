cmake_minimum_required( VERSION 3.0.0 )

project( voronoizer VERSION 1.0.2 )

# configure_file()
set( CMAKE_CXX_STANDARD 17 )
set(CMAKE_FIND_LIBRARY_SUFFIXES .a .lib)

find_package( OpenCV REQUIRED )
find_package( redis++ REQUIRED )
find_package( PahoMqttCpp REQUIRED )

include_directories( ${OpenCV_INCLUDE_DIRS} )

add_subdirectory(${CMAKE_CURRENT_LIST_DIR}/src)
