cmake_minimum_required( VERSION 3.22.0 )

project( voronoizer VERSION 1.0.3 LANGUAGES CUDA CXX )

configure_file(${CMAKE_CURRENT_LIST_DIR}/src/voronoizer/include/version.hpp.in ${CMAKE_CURRENT_LIST_DIR}/src/voronoizer/include/version.hpp)
set( CMAKE_CXX_STANDARD 17 )
set(CMAKE_FIND_LIBRARY_SUFFIXES .a .lib)

# set(USE_CUDA TRUE)

if (USE_CUDA)
  message("USING CUDA")
  add_compile_definitions(USE_CUDA)
  set(CMAKE_CUDA_COMPILER /usr/local/cuda-11.8/bin/nvcc)
  message("Compiling voronoizer with cuda")
  enable_language(CUDA)
  include(CheckLanguage)
  check_language(CUDA)

  include_directories(${CUDA_INCLUDE_DIRS})

  if(NOT DEFINED CMAKE_CUDA_STANDARD)
    set(CMAKE_CUDA_STANDARD 14)
    set(CMAKE_CUDA_STANDARD_REQUIRED ON)
  endif()
endif()

# if (MSVC)
#     # warning level 4 and all warnings as errors
#     add_compile_options(/W4 /WX)
# else()
#     # lots of warnings and all warnings as errors
#     add_compile_options(-Wall -Wextra -pedantic -Werror)
# endif()

find_package( OpenCV REQUIRED )
find_package( redis++ REQUIRED )
# find_package( PahoMqttCpp REQUIRED )
find_package( Iconv )

message( ${OpenCV_INCLUDE_DIRS} )

include_directories( ${OpenCV_INCLUDE_DIRS} )

add_subdirectory(${CMAKE_CURRENT_LIST_DIR}/src)