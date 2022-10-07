# Lannootree

## Cloning git repo

```bash
git clone git@github.com:vives-project-xp/Lannootree.git --recursive
```

## Project structure:

- Lannootree_controller:
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