cmake_minimum_required( VERSION 3.0.0 )

project( voronoizer VERSION 1.0.2 )

# configure_file()
set( CMAKE_CXX_STANDARD 17 )

find_package( OpenCV REQUIRED )
include_directories( ${OpenCV_INCLUDE_DIRS} )

find_package( redis++ REQUIRED )

add_subdirectory(${CMAKE_CURRENT_LIST_DIR}/src)
