FROM node:latest as builder

WORKDIR /app

COPY vueproject_lannootree/package*.json ./
RUN npm install

ARG VITE_LOGOUT_URL

COPY vueproject_lannootree/ ./
RUN npm run build

FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html