FROM gcc:latest

WORKDIR /builder/

COPY ./updatelib .

RUN apt-get update
RUN apt-get install git
RUN apt-get install build-essential cmake -y

# Install libhiredis
RUN apt-get install libhiredis-dev -y

# Install redis++ lib
RUN git clone https://github.com/sewenew/redis-plus-plus.git &&\
  cd redis-plus-plus &&\
  mkdir build &&\
  cd ./build &&\
  cmake .. &&\
  make -j4 &&\
  make install &&\
  cd ../.. &&\
  rm -rf ./redis-plus-plus/

# Install paho-mqttpp C lib
RUN git clone https://github.com/eclipse/paho.mqtt.c.git &&\
  cd paho.mqtt.c &&\
  git checkout v1.3.8 &&\
  cmake -Bbuild -H. -DPAHO_ENABLE_TESTING=OFF -DPAHO_BUILD_STATIC=ON -DPAHO_WITH_SSL=ON -DPAHO_HIGH_PERFORMANCE=ON &&\
  cmake --build build/ --target install &&\
  ldconfig &&\
  cd .. &&\
  rm -rf ./paho-mqtt.c/

# Install paho-mqttpp C++ lib
RUN git clone https://github.com/eclipse/paho.mqtt.cpp &&\
  cd paho.mqtt.cpp &&\
  cmake -Bbuild -H. -DPAHO_BUILD_STATIC=ON -DPAHO_BUILD_DOCUMENTATION=FALSE -DPAHO_BUILD_SAMPLES=FALSE &&\
  cmake --build build/ --target install &&\
  ldconfig &&\
  cd .. &&\
  rm -rf ./paho.mqtt.cpp/

COPY . .

ENV MQTT_SERVER_ADDRESS "127.0.0.1"
ENV MQTT_SERVER_PORT "1883"

ENV REDIS_SERVER_ADDRESS "127.0.0.1"
ENV REDIS_SERVER_PORT "6379"

RUN g++ ./main.cpp -L./bin/shared -lpaho-mqttpp3 -lpaho-mqtt3as -lredis++ -lhiredis -o ./mqtt2redis

CMD ./mqtt2redis ${MQTT_SERVER_ADDRESS} ${MQTT_SERVER_PORT} ${REDIS_SERVER_ADDRESS} ${REDIS_SERVER_PORT}
