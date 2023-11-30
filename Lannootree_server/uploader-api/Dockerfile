FROM node:latest as builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN apt-get update && \
    apt-get install -y \
        python3 \
        python3-pip \
        python3-dotenv \
    && pip3 install \
        opencv-python-headless \
        imageio \
        matplotlib \
        paho-mqtt --break-system-packages
        
# Uncomment the following RUN command for a server environment along with --break-system-packages above
RUN apt-get install -y \
        libsm6 \
        libxext6 \
        libxrender-dev

CMD npm start
