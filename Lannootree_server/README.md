# Lannootree_server

## Configuration before install

### Admin-api

### Authelia

1. Copy authelia configuration-example.yml to configuration.yml
2. Change all the secrets in the file to random strings
3. Copy user_database_example.yml to user_Database.yml
4. Add all the users to the file. Also place the users in the correct group. This sets the permissions.
5. Once authelia and traefik are online, Reset the passwords for all the users bu clicking reset password. and click the link in notification.txt

## Button-mapper

## Client-api

## Controller

## Effect-generator

## Frontend

## Githook

## Mqtt

Mosquitto needs certificates for SSL-TLS and for each client to connect securely.
Follow [this guide](mqtt/README.md) in the mqtt directory.

## Storage

## Traefik

## Uploader-api

## .env

## Deploy all containers

```bash
docker-compose up -d
```
