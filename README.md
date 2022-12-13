# Lannootree

[![OS - Linux](https://img.shields.io/badge/OS-Linux-blue?logo=linux&logoColor=white)](https://www.linux.org/ "Go to Linux homepage")
[![Made with Docker](https://img.shields.io/badge/Made_with-Docker-blue?logo=docker&logoColor=white)](https://www.docker.com/ "Go to Docker homepage")
[![Made with Python](https://img.shields.io/badge/Python->=3.6-blue?logo=python&logoColor=white)](https://python.org "Go to Python homepage")
[![Made with Node.js](https://img.shields.io/badge/Node.js->=12-blue?logo=node.js&logoColor=white)](https://nodejs.org "Go to Node.js homepage")
[![Made with TypeScript](https://img.shields.io/badge/TypeScript-4-blue?logo=typescript&logoColor=white)](https://typescriptlang.org "Go to TypeScript homepage")
[![Made with Vue](https://img.shields.io/badge/Vue-3-blue?logo=vue.js&logoColor=white)](https://v3.vuejs.org "Go to Vue homepage")

Welcome to the Lannootree Project! The Lannootree is a modular LED display with a central server that allows users to display media and other content. You can display a wide range of media, including videos, images, and text, in a dynamic and engaging way. The central server makes it easy to manage and update the content that is displayed.

This is a project for Project Experience 2022, and is designed to be both versatile and easy to use.

## Team

![Made with Love - by team Lannootree!](https://img.shields.io/static/v1?label=Made+with+Love&message=by+team+Lannootree!&color=2ea44f)

[<img src="https://github.com/madness007.png" width="25"> Arno Schoutteten](https://github.com/madness007)

[<img src="https://github.com/EmielCoucke.png" width="25"> Emiel Coucke](https://github.com/EmielCoucke)

[<img src="https://github.com/JayDHulster.png" width="25"> Jay D'Hulster](https://github.com/JayDHulster)

[<img src="https://github.com/JensVA.png" width="25"> Jens Vanhove](https://github.com/JensVA)

[<img src="https://github.com/JoeyDeSmet.png" width="25"> Joey De Smet](https://github.com/JoeyDeSmet)

![Team](img/groupphoto.JPG)

## Features

- A frontend to controll the whole project
- ...

## Getting started

```bash
git clone git@github.com:vives-project-xp/Lannootree.git
```

### installation

- [Server](Lannootree_server/README.md)
- [Processor](Lannootree_processor/README.md)
- [Firmware](Lannootree_firmware/README.md)

## Folder Structure Lannootree

- [certs](certs/README.md) manages all client and server certificates.
- [Lannootree_firmware](Lannootree_firmware/README.md) contains the led-client and led-driver. Those are running on the raspberry pi.
- [Lannootree_hardware](Lannootree_hardware/README.md) In this folder you can find two samples of code for a remote control.
- [Lannootree_processor](Lannootree_processor/README.md) is used to set-up dockercontainers of the processor. It runs on the server, but can be deployed on a stronger server or computer.
- [Lannootree_server](Lannootree_server/README.md) is the directory with all services that runs on the server itself.

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
  - Out
    - Metadata
* Storage
  - In
    - Metadata
  - Play
  - Status
* Logs: All services can push logs to logs/\<service>
* Status: Shows the status of all MQTT services ex Online or Offline

## Blogpost about The Lannootree

![Blogpost](img/Blogpost.png)

## Docker structure

![Lannootree drawio](https://user-images.githubusercontent.com/71697142/201103114-a8b4d791-ab4f-4459-9a90-6e0a4993ae48.png)

## Data flow

![DataflowLT drawio](https://user-images.githubusercontent.com/71697142/205050305-787bca8d-d48e-46d5-b0a1-096201860b0a.png)

## Licence

### Hippity Hoppity. This project is our property! :smile:

The [MIT License](LICENSE) is in place.

So the following is allowed:

- Commercial use
- Modification
- Distribution
- Private use

### Please contribute and let this project live a long and happy life!
