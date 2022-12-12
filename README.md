# Lannootree

## Team

![Team](img/groupphoto.JPG)

## Blogpost about The Lannootree

![Blogpost](img/Blogpost.png)

## Cloning git repo

```bash
git clone git@github.com:vives-project-xp/Lannootree.git
```

## installation

- [Server](Lannootree_server/README.md)
- [Processor](Lannootree_processor/README.md)
- [Firmware](Lannootree_firmware/README.md)

## Docker structure

![Lannootree drawio](https://user-images.githubusercontent.com/71697142/201103114-a8b4d791-ab4f-4459-9a90-6e0a4993ae48.png)

## Data flow

![DataflowLT drawio](https://user-images.githubusercontent.com/71697142/205050305-787bca8d-d48e-46d5-b0a1-096201860b0a.png)

## MQTT Topics

* Controller:
  - In
  - Out
* Panel
  - Control
  - id#...
  - Matrix
  - Frame
* Voronoi
  - In
  - id#...
  - Controll
  - Status
    - ID
    - Power
  - Out
    - Metadata
* Storage
  - In
    - Metadata
  - Play
  - Status
* Logs
* Status

# Lannootree Documentation

## Map Structure LANNOOTREE

### [certs](certs/README.md)

This folder Manage all client and server certificates.

### [img](img/README.md)

Here you will find the images that are displayed on the frontend and readme.

### [Lannootree_firmware](Lannootree_firmware/README.md)

In this folder you can find the led-client en -driver. This is used to control the leds on the Lannootree.

### [Lannootree_hardware](Lannootree_hardware/README.md)

In this folder you can find two samples of code for a remote control.

### [Lannootree_processor](Lannootree_processor/README.md)

This folder is used to set-up dockercontainers of the processor-api, redis and voronoi.

### [Lannootree_server](Lannootree_server/README.md)

Here are all