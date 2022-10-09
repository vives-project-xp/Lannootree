# Lannootree

## Cloning git repo

```bash
git clone git@github.com:vives-project-xp/Lannootree.git --recursive
```

## Docker structure:

- Lannootree_server:
This is the controller that runs on the public server
    - asset-processor
    - authelia
    - client-api
    - config-webpage
    - frontend
    - mqtt
    - traefik

- Lannootree_firmware:
This runs on the raspberry pi and makes connection to the main controller
    - controller
    - led-driver

## project structure

- Frontend webpage
    - vue webpagina
    - Websocket connection to client-api

- Public server
    - client api sends commands to mqtt
    - client api sends assets to mqtt

- Asset processor
    - gets assets from mqtt and proceses them

- Raspberry pi
    - controller gets commands from mqtt
    - controller requests assets from processor via mqtt
    - controller connects to led-driver via unix socket

## installation

- [Server](Lannootree_server/README.md)
- [Firmware](Lannootree_firmware/README.md)