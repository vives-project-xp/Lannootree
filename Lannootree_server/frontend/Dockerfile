FROM node:latest as builder

WORKDIR /app

COPY package*.json ./
RUN npm install

ARG VITE_LOGOUT_URL
ARG VITE_FRONTEND_WEBSOCKET

COPY ./ ./
RUN npm run build

FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html