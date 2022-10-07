FROM node:latest as builder

WORKDIR /app

COPY package*.json ./
RUN npm install --save-dev @types/vue3-highlightjs

COPY ./ ./
RUN npm run build

FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html