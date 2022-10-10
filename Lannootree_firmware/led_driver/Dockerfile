FROM gcc:latest as builder

WORKDIR /lannootree

COPY . .

# Get necessary tools
RUN apt-get update
RUN apt-get install cmake -y
RUN apt-get install build-essential -y
RUN apt-get install libpthread-stubs0-dev -y

ENV JSON_FILE_PATH "./config.json"

RUN mkdir build &&\
    cd build &&\
    cmake -D JSON_FILE_PATH=${JSON_FILE_PATH} -D CMAKE_BUILD_TYPE=Release -D BUILD_SHARED=ON -D BUILD_TEST=OFF .. &&\
    make -j4

FROM alpine:latest

WORKDIR /lannootree

RUN apk add --no-cache libgcc
RUN apk add --no-cache libstdc++
RUN apk add --no-cache libc6-compat

RUN mkdir ./dev/

COPY --from=builder /lannootree/build/rpi_ws281x/libws2811.so /usr/lib/libws2811.so
COPY --from=builder /lannootree/build/ProjectFiles/Lannootree_firmware .
COPY --from=builder /lannootree/config.json .
COPY --from=builder /lannootree/ProjectFiles/utils/include/lannootree_config.hpp .

CMD ./Lannootree_firmware
