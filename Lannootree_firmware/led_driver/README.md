# Lannootree firmware

## Setup

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
  cmake -D BUILD_SHARED=ON -D BUILD_TEST=OFF -D JSON_FILE_PATH=/path/to/config.json ..

  make -j4
  ```

- Executable binary will be in the build/ProjectFiles/ directory

## Or use docker image

The application in the docker container makes a Unix socket in /lannootree/dev/ directory.
This need to be binded to a volume so it can be accessed.

```bash
docker build lannootee:latest  .
docker run -v "$(pwd)/dev/":/lannootree/dev/ lannootree
```

## Communication over socket
