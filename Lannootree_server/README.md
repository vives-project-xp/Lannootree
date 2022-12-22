# Lannootree_server

## Configuration before install

### Admin-api

This code is using various libraries to establish a connection to an MQTT broker, which it uses to receive log messages from other services. It then stores these log messages in an SQLite database, and uses a WebSocket server to push the logs to connected clients in real-time. It also maintains a buffer of the latest status messages it receives from the MQTT broker and pushes these to connected clients as well.

### Authelia

#### Setup

1. Copy authelia configuration-example.yml to configuration.yml
2. Change all the secrets in the file to random strings
3. Copy user_database_example.yml to user_Database.yml
4. Add all the users to the file. Also place the users in the correct group. This sets the permissions.
5. Once authelia and traefik are online, Reset the passwords for all the users bu clicking reset password. and click the link in notification.txt.

## Button-mapper

This code is using the MQTT library to establish two connections to an MQTT broker: one using MQTT**S** with client certificates for secure communication, and one using plain MQTT. It subscribes to two topics, esp_remote and esp_remote_mini, and when it receives messages on these topics it parses the message and maps the received button presses to specific commands that it then publishes on the controller/in topic using the MQTTS connection. This allows the button mapper service to securely communicate with the controller service using MQTTS.

## Client-api

This code is a WebSocket server that receives commands from clients and sends them to an MQTT broker. It also listens for messages from the MQTT broker and sends them to connected clients. It is using the MQTT library to establish a secure MQTT connection using MQTTS and client certificates. The commands that the server can handle include stop, pause, play, media, and color. When the server receives one of these commands, it publishes the appropriate message on the controller/in topic using the MQTTS connection. When it receives a message on the controller/status or lannootree/out topics, it parses the message and sends it to connected clients.

## Controller

The code is a Node.js script that uses the MQTT protocol to communicate with other devices or services. It is part of a larger system that controls LED lights and plays media on a LED panel. The script receives commands from other devices or services, such as "play", "pause", and "set color", and then sends the appropriate command to the LED panel using the MQTT protocol. Additionally, the script can monitor the status of the LED panel and send that information back to other devices or services.

## Effect-generator

## Frontend

In this map you can find the Vuetify code to control the lannootree. Here you have the different components. Also the different pages: landing, media, config, logging and upload.

## Githook

This webhook receives a POST request from Git whenever a code push is made, triggering the code to be updated online. This allows for seamless and automated deployment of code changes.

## MQTT

Mosquitto needs certificates for SSL-TLS and for each client to connect securely.
Follow [this guide](mqtt/README.md) in the MQTT directory.

## Storage

## Traefik

Traefik is a modern HTTP reverse proxy and load balancer that makes deploying microservices easy. Traefik integrates with your existing infrastructure components (Docker, Swarm mode, Kubernetes, Marathon, Consul, Etcd, Rancher, Amazon ECS, ...) and configures itself automatically and dynamically. Pointing Traefik at your orchestrator should be the only configuration step you need.

## Uploader-api

This is an API that allows users to upload images to a specified MQTT broker. It uses the express and MQTT libraries to create an API endpoint and connect to the MQTT broker. The API uses dotenv to load environment variables from a .env file, which is used to configure the MQTT connection. The API also uses the body-parser library to parse the body of incoming requests, allowing it to access the files being uploaded. When a user uploads an image, the API publishes the image to the MQTT broker, which can then be accessed by other applications.

## Deploy all containers

```bash
docker-compose up -d
```
