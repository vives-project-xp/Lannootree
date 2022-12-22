# Voronoizer V1.0.3

This program is used to process images to the right format, to be used for the lannootree.

## Contents

- [Usage](#usage)
  - [Options](#options)
  - [Frame providers](#frame-provides)
  - [Defining frame providers](#defining-your-own-frame-provider)
  - [Defining formatter](#defining-your-own-formatter)
- [Build](#build)
  - [Dependancies](#dependancies)
  - [Linux](#linux)
  - [CUDA support](#cuda-support)
- [Running standalone container](#running-standalone-container)
  - [Linux](#linux-1)
- [Precompiled binairy](#precompiled-binary-usage-linux-only)

## Usage

This progam is a command line tool that can be executed to process your images or video's for the lannootree.

### Options

| Argument | Alternate        | Function                      | Required | Default                |
|----------|------------------|-------------------------------|----------|------------------------|
| -h       | --help           | Shows help menu               | -        | -                      |
| -v       | --version        | Shows version information     | -        | -                      |
| -t       | --threads        | Sets amount of threads to use | False    | 4                      |
| -p       | --frame-provider | Sets frame provider to use    | True     | -                      |
| -f       | --formatter      | Set formatter to use          | True     | -                      |
| -        | --redis-url      | Set redis url to use          | False    | redis://localhost:6379 |
| -        | --image          | Path to image file            | False    | -                      |
| -        | --config         | Path to config.json file      | False    | ./config.json          |

### Frame provides

The following frame providers have already been implemented.

**Camera**:
  This provider will take the default camera and will process the frames gotten from the camera.

**Redis**:
  This provider will use a `BRPOP` redis query to get the next frame, than it will try to decode and process the frame.

**Single image**:
  This provider will process the image you provided with the `--image` argument.

**Video**:
  This privder will process the video you provided with the `--image` argument. (**Note**: Only tested with avi format)

### Formatters

The following fromatters have already been implemented.

**JSON-local**:
  This formatter wil format the frames in a json format and store it as a local json file.

**JSON-redis**:
  This formatter wil format the frames in a json formate and use the `LPUSH` redis query to push the formatted frame, frame by frame on redis.

### Defining your own frame provider

You can define your own frame provider, by using the FrameProvder base class.

```cpp
/**
 * @brief 
 * Interface class use to create frame providers for the voronoizer
 * 
 */
class FrameProvider {

  public:
    /**
     * @brief 
     * Method to let voronoizer know if there are more frames to come
     * 
     * @return true 
     * When more frames will come
     * @return false 
     * When all frames have been processed and program can shut down
     */
    virtual bool has_next_frame(void) = 0;

    /**
     * @brief 
     * Here you should get the frame you want to process and place it in m_frame and then return m_frame
     * 
     * @return cv::Mat& 
     */
    virtual cv::Mat& next_frame(void) = 0;     

  protected:
    cv::Mat m_frame;

};
```

### Defining your own formatter

You can define your own formatter, by using the Formatter base class.

```cpp
/**
 * @brief 
 * Interface class use to create different formaters used to format the processed data from voronoizer
 * 
 */
class Formatter {

  public:
    /**
     * @brief 
     * Method called after frame has been processed 
     * 
     * @param cstring 
     * Vetor reference to processed data
     * 
     * @param frame
     * Mat reference to processed frame
     */
    virtual void format(std::vector<uint8_t>& cstring, cv::Mat& frame) = 0;

};
```

## Build

This project uses cmake to build this project.

### Dependancies

- [OpenCV](https://github.com/opencv/opencv)

### Linux

On linux you will have to install some other packages.

```bash
sudo apt-get update
sudo apt-get install libwebp-dev libopenjp2-7 libgtk2.0-dev -y
```

### Compiling

Run the following commands to compile the project

```bash
mkdir build && cd build
cmake .. && make -j4
```

### Cuda support

This program can be build with cuda, `CUDA 11.8` was used for this. To enable cuda support use these compile steps.

```bash
mkdir build && cd build
cmake -DUSE_CUDA=TRUE .. && make -j4
```

## Running standalone container

### Linux
**Note**: Tested on Ubuntu 22.04 LTS, this may differ for other distros.

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

Set the ARGUMENT env, to pass arguments to the voronoizer program see [Options](#options).

```bash
docker run -it --env="DISPLAY" --volume="/tmp/.X11-unix:/tmp/.X11-unix:rw" --device="/dev/video0:/dev/video0" --env ARGUMENTS="-t 12 --frame-provider camera" voronoizer:latest
```

# Precompiled binary usage (LINUX ONLY)

**NOTE**: This was testes and compiled on Ubuntu 22.04 LTS.

## Install required libs

These libraries are needed because these can't be staticly linked.

```bash
sudo apt-get update
sudo apt-get install libwebp-dev libopenjp2-7 libgtk2.0-dev -y
```
