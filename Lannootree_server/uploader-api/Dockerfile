FROM node:latest

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN apt-get update && \
    apt-get install -y python3 python3-pip libsm6 libxext6 libxrender-dev

RUN pip3 install opencv-python-headless imageio matplotlib --break-system-packages

CMD npm start
