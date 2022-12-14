# Voronoizer V1.0.3

# Docker container

## Building standalone container
```bash
docker build -t voronoizer:latest .
```

## Running standalone container

### Linux
**Note**: Tested on Ubuntu 22.04 LTS, this may differ for other distros

To show live preview of the processed data you will have to give the container privalage to create a window.

#### Enable
```bash
xhost +local:
```

#### Disable
```
xhost -local:
```

#### Run the container
Set the ARGUMENT env, to pass arguments to the voronoizer program see [Help menu](#help-menu).

```bash
docker run -it --env="DISPLAY" --volume="/tmp/.X11-unix:/tmp/.X11-unix:rw" --device="/dev/video0:/dev/video0" --env ARGUMENTS="-t 12 --frame-provider camera" voronoizer:latest
```

### Windows

NOT TESTED

# Precompiled binary usage (LINUX ONLY)

**NOTE**: This was testes and compiled on Ubuntu 22.04 LTS.

## Install required libs

These libraries are needed because these can't be staticly linked.

```bash
sudo apt-get update
sudo apt-get install libwebp-dev libopenjp2-7 libgtk2.0-dev -y
```

# Help menu

```text
Usage: Voronoizer [--help] [--version] [--threads VAR] --frame-provider VAR [--redis-url VAR] [--image VAR] [--config VAR]

Optional arguments:
  -h, --help            shows help message and exits 
  -v, --version         prints version information and exits 
  -t, --threads         Sets the number of theads to use [default: 4]
  -p, --frame-provider  Sets the frame provider to use can be: [ "camera" "redis" "single-image" ] [required]
  --redis-url           redis url to use when frame provider is redis [default: "redis://localhost:6379"]
  --image               Path to image to process 
  --config              Path to config.json file [default: "./config.json"]
```

# Building project on your own

This project was developed on a linux machine so, for windows you will have to figure that out on you own for the moment. 
But i know Visual Studio community supports CMake projects.


