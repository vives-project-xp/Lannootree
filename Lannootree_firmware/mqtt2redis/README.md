# MQTT to Redis

This docker container set up a MQTT broker and Redis database.</br>
All messages incomming from MQTT broker will be put in the redis database.</br>

## This will probably not be used :(

## Setup

```bash
docker compose up
```

## Mqtt Server

```bash
docker run --name mosquitto -p 1883:1883 -p 9001:9001 -v ~/mosquitto.conf:/mosquitto/config/mosquitto.conf eclipse-mosquitto
```

## Mqtt c++ library

<https://github.com/eclipse/paho.mqtt.cpp>

## Redis docker

```bash
docker run --name redis -p 6379:6379 redis
```

## Redis c++ library

<https://github.com/sewenew/redis-plus-plus>
