FROM ubuntu

WORKDIR /app

RUN apt-get update
RUN apt-get install libgtk2.0-dev libopenjp2-7 libwebp-dev -y

COPY ./precompiled_bin/Voronoizer ./Voronoizer

ENV ARGUMENTS=""

CMD ./Voronoizer ${ARGUMENTS}
