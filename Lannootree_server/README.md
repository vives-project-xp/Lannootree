# Lannootree controller

## Configuration

### authelia

1. Copy authelia configuration-example.yml to configuration.yml
2. Change all the secrets in the file to random strings
3. Copy user_database_example.yml to user_Database.yml
4. Add all the users to the file. Also place the users in the correct group. This sets the permissions.
5. Once authelia and traefik are online, Reset the passwords for all the users bu clicking reset password. and click the link in notification.txt

### MQTT certificates

Mosquitto needs certificates for SSL-TLS and for each client to connect securely.
Follow [this guide](mqtt/README.md) in the mqtt directory.

### asset processor

This is a seperate docker-compose file. Because it can run on a different server with more power.

## Deploy all containers

```
docker-compose up -d
```


## mqtt users

| add user
```
docker-compose exec mosquitto mosquitto_passwd -b /mosquitto/config/password.txt user password
```
| delete user
```
docker-compose exec mosquitto mosquitto_passwd -D /mosquitto/config/password.txt user
```
