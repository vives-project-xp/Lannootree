# Lannootree firmware

## Setup
- Pull in submodules if not already pulled in.

  ```bash
  git submodules update --init
  ```

- Before installing you have to edit some lines.
  - Open the CMakeLists.txt file in de rpi_ws281x/ folder
  - Edit two lines:
    - before:
    ```cmake
    option(BUILD_SHARED "Build as shared library" OFF)
    option(BUILD_TEST "Build test application" ON)
    ```
    - after:
    ```cmake
    option(BUILD_SHARED "Build as shared library" ON)
    option(BUILD_TEST "Build test application" OFF)
    ```
- Install necessary tools

  ```bash
  sudo apt install gcc -y
  sudo apt install build-essential -y
  sudo apt install cmake -y
  ```
- Build project
  ```bash
  mkdir build
  cd build
  cmake ..

  make -j4
  ```

- Executable binary will be in the build/ProjectFiles/ directory

