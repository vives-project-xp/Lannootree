FROM node:latest as builder

WORKDIR /app

COPY package*.json ./

RUN npm install

ARG LOGOUT_URL
ARG APP_URL

COPY ./ ./
RUN npm run build

FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html

COPY nginx.conf /etc/nginx/nginx.conf
