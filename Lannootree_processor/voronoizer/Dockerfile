FROM ubuntu

WORKDIR /app

RUN apt-get update
RUN apt-get install -y libwebp-dev libopenjp2-7 libgtk2.0-dev

COPY ./precompiled_bin/voronoizer ./voronoizer

ENV ARGUMENTS=""

CMD ./voronoizer ${ARGUMENTS}
