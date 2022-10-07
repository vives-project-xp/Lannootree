# Lannootree controller

## Docker
```
docker-compose up -d
```
- Frontend httpd
- controller nodejs for all the logic
- asset-processor for processing and managing assets
- mosquitto mqtt server


## mqtt users

| add user
```
docker-compose exec mosquitto mosquitto_passwd -b /mosquitto/config/password.txt user password
```
| delete user
```
docker-compose exec mosquitto mosquitto_passwd -D /mosquitto/config/password.txt user
```