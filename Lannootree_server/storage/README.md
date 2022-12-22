# Storage

The `storage` keeps track of all the stored media files (processed by the voronoi-container in json format) on the filesystem (FS) and their entries in the database (DB). It has a lot of features listed down below:

## Features

* A `mysql` database will be created on startup.
* Processed json files (by voronoi-container) can be `inserted into the DB and FS over MQTT`.
* The storage will `stream` a json file based on DB media_id frame per frame over a given MQTT topic so that the led-client can put them on the Lannootree (controller by the [controller](../controller/README.md))
* The stream can be `stopped/paused/resumed` at all time by the controller.
* When asked, the storage will send all the `currently available media` over MQTT (the ones that aren't deleted).

The database can be modified by `phpMyAdmin` when going to port `8080` of the Server.

## The database

example:

| id | name | category | description | config_hash | deleted |
|---|---|---|---|---|---|
| 1 | Running Pikachu | gif | description_Running Pikachu | config1 | NULL |
| 2 | Vives | gif | description_Vives | config1 | NULL |
|...|...|...|...|...|...|

* `id`: primaray key of the DB (filenames on the filesystem are named based on their id under the db folder)
* `name`: name of the media
* `category`: category of the media
* `description`: description of the media
* `config_hash`: should be a hashed version of the JSON generated by the config page on the frontend so only media for the current LedPanel configuration can be played. For now it's always `config1` because that JSON contains random values.
* `deleted`: there's currenlty no way of deleting media from the frontend. For now, media can only be 'deleted' by adding a timestamp to this column by phpMyAdmin. Otherwise, it's default NULL.

## MQTT topics

The storage listens to the `storage/in` topic on MQTT. Commands over this topic should be sent in json format like this:

```json
{"command": "...", "data1": "...", "data2": "..."}
```

The list of possible `commands` and their required `data` (examples) is listed below:

* `add_file` (sent by voronoi, containing a processed json file)
  
  ```json
  {"command": "add_file", "json": ["...jsonbody..."], "name": "1. Running Pikachu", "category": "gif", "description": "description_Running Pikachu"}
  ```

* `send_media` (sent by controller)

  ```json
  {"command": "send_media"}
  ```

* `play` (sent by controller)

  ```json
  {"command": "play", "id": 15, "streamtopic": "stream_045"}
  ```

* `stop_current` (sent by controller)

  ```json
  {"command": "stop_current"}
  ```

* `pause_current` (sent by controller)

  ```json
  {"command": "pause_current"}
  ```

* `play_current` (sent by controller)

  ```json
  {"command": "play_current"}
  ```