add_subdirectory(src/)
add_subdirectory(utils/)

add_executable(Lannootree_firmware main.cpp)

target_include_directories(Lannootree_firmware PUBLIC
  ${CMAKE_CURRENT_LIST_DIR}/../rpi_ws281x/
)

target_link_libraries(Lannootree_firmware
  lannootree
  utils
  ws2811
  controll
)
