FROM ubuntu

RUN apt-get update
RUN apt-get install libgtk-3-0 libgtk2.0-dev libopenjp2-7 libwebp-dev ffmpeg -y

COPY ./precompiled_bin/Voronoizer ./Voronoizer
COPY ./config.json ./config.json

ENV ARG0=""
ENV ARG1=""
ENV ARG2=""
ENV ARG3=""

CMD "./Voronoizer" ${ARG0} ${ARG1} ${ARG2} ${ARG3}
