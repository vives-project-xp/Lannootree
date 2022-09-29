FROM node:latest as builder

COPY package*.json .

RUN npm run build

FROM nginx:latest

