# Lannootree firmware

## Setup
- Pull in submodules if not already pulled in.

  ```bash
  git submodules update --init
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
  cmake -D BUILD_SHARED=ON -D BUILD_TEST=OFF ..

  make -j4
  ```

- Executable binary will be in the build/ProjectFiles/ directory

## Mqtt Server

```bash
docker run --name mosquitto -p 1883:1883 -p 9001:9001 -v ~/mosquitto.conf:/mosquitto/config/mosquitto.conf eclipse-mosquitto
```

## Mqtt c++ library

https://github.com/eclipse/paho.mqtt.cpp

## Redis docker

```bash
docker run --name redis -p 6379:6379 redis
```

## Redis c++ library

https://github.com/sewenew/redis-plus-plus
