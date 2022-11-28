# Lannootree

## Cloning git repo

```bash
git clone git@github.com:vives-project-xp/Lannootree.git
```

## installation

- [Server](Lannootree_server/README.md)
- [Firmware](Lannootree_processor/README.md)
- [Firmware](Lannootree_firmware/README.md)

## Docker structure:

![Lannootree drawio](https://user-images.githubusercontent.com/71697142/201103114-a8b4d791-ab4f-4459-9a90-6e0a4993ae48.png)

## Data flow:

![DataflowLT drawio](https://user-images.githubusercontent.com/71697142/203812506-f585d0dc-2eda-4000-9cf0-2d6f3b3efd72.png)

## MQTT Topics:

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





