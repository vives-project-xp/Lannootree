# Lannootree controller

## installation



## Docker

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