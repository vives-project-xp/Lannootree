# Lannootree firmware

![](https://img.shields.io/badge/C++-C++17-blue) ![](https://img.shields.io/badge/Typescript-4.8.x-blue) 

## Contents
- [Containers](#containers)
  - [Led-client](#led-client)
  - [Led-driver](#led-driver)
- [Setup and instalation](#setup-and-installation)

# Containers

## Led-client
#### Description
This container is responsable for listening on mqtt, processing those commands, and sending color data to the led-driver in order to drive leds.

### Container info
![](https://img.shields.io/badge/Typescript-4.8.x-blue)

**Base Image**: node:latest

**.Env file**:

.env file has to be placed in the /Lannootree_firmware/ directory where the list of variables have to be defined:

  - MQTT_BROKER_URL
  - MQTT_BROKER_PORT

**Volumes**:

The led-client depends on certificates, that will be passed in as a volume.
Go to [certs](../certs/README.md) directory to see how to setup certs.

At this moment the json config has to be in the /Lannootree_firmware/ directory but this will later be done an other way.

**Depends On**:
  - Led-driver


## Led-driver
### Description
Container responsable for driving led's, and listen to incomming color string on unix socket.

### Class documentation
Class documentation will be build by Doxygen upon a cmake build, when you have this installed. Documentation will be placed in /led-driver/docs/gen_docs/ directory.

### Container info
![](https://img.shields.io/badge/C++-C++17-blue)


**Base Image**: gcc:latest

**Volumes**:
At this moment the json config has to be in the /Lannootree_firmware/ directory but this will later be done an other way.

To change location of sockets bind the desired path to /lannootree/dev and sockets will be placed there.

## Setup and installation

This project uses docker compose to start all necessesairy processes. Look to the mentions containers above to know what volumes/envirioments you will have to add.

```bash
docker compose up -d
```
