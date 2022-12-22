FROM gcc:latest as builder

WORKDIR /lannootree

COPY CMakeLists.txt .

# Get necessary tools
RUN apt-get update
RUN apt-get install cmake -y
RUN apt-get install build-essential -y
RUN apt-get install libpthread-stubs0-dev -y

COPY . .

ENV JSON_FILE_PATH "./config.json"

RUN mkdir build &&\
    cd build &&\
    cmake -D JSON_FILE_PATH=${JSON_FILE_PATH} -D CMAKE_BUILD_TYPE=Release -D BUILD_SHARED=ON -D BUILD_TEST=OFF .. &&\
    make -j4

STOPSIGNAL SIGINT

ENTRYPOINT [ "./build/ProjectFiles/Lannootree_firmware" ] 
