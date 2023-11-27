FROM node:latest as builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN apt-get update && \
    apt-get install -y python3 python3-pip

RUN pip3 install opencv-python-headless imageio matplotlib

CMD npm start
