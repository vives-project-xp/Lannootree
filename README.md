# Lannootree

## Cloning git repo

```bash
git clone git@github.com:vives-project-xp/Lannootree.git
```

## Docker structure:

![Lannootree drawio](https://user-images.githubusercontent.com/71697142/195917978-49e236e8-681d-4605-afdd-4751ff961074.png)


<!-- - Lannootree_server:
This is the public server
    - traefik
    - authelia
    - frontend
    - client-API
    - admin-webpage
    - admin-API
    - uploader-frontend
    - uploader-API
    - mqtt broker
    - asset-API
    - asset-processor

- Lannootree_firmware:
This runs on the raspberry pi and makes connection to the public server
    - controller
    - led-driver
  
- Asset-Client:
This is a client that connects to mqtt and handles jobs to process assets
    - asset-processor -->

## installation

- [Server](Lannootree_server/README.md)
- [Firmware](Lannootree_firmware/README.md)
