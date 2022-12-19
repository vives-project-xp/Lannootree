# Controller

This part of the Lannootree is the `controller`. The controller handles all the request sent over MQTT by the frontend (client-api). Based on those requests, it will send commands (also over MQTT) to both the storage and led-client to control the LedPanel.

## Features

* When a `development-controller` starts (started local with 'npm run dev'), the controller on the server (docker) will automatically go in sleep-mode to prevent conflicts.
* Set the `ontime` for the LedPanel (for ex. '08:00-18:00'). This will make sure the LedPanel automatically turns off/on based on that time interval.
* `Play media` based on the media_id. The controller will then command the storage and led-client to show the media on the LedPanel.
* `pause/play/stop` the currently playing media on the ledPanel.
* send a `static color` to the LedPanel (RGB format).
* every 20 seconds and on every variable change, a `statusmessage` will be sent to update the frontend.

## MQTT topics

The controller listens to the `controller/in` topic on MQTT. Commands over this topic should be sent in json format like this:

```json
{"command": "...", "data1": "...", "data2": "..."}
```

The list of possible `commands` and their required `data` (examples) is listed below:

* `ontime` (sent by user)
  
  ```json
  {"command": "ontime", "ontime": "08:00-18:00"}
  ```

* `media` (sent by storage)

  ```json
  {"command": "media", "media": [{"id": 1,"name": "1. Running Pikachu","category": "gif","description": "description_Running Pikachu"},{"..."}]}
  ```

* `pause` (sent by client-api)

  ```json
  {"command": "pause"}
  ```

* `play` (sent by client-api)

  ```json
  {"command": "play"}
  ```

* `stop` (sent by client-api)

  ```json
  {"command": "stop"}
  ```

* `color` (sent by client-api)

  ```json
  {"command": "color", "red": 247, "green": 0, "blue": 197}
  ```

* `playmedia` (sent by client-api)

  ```json
  {"command": "play_media", "media_id": 15}
  ```

* `acceptstream` (sent by storage)

  ```json
  {"command": "accepstream", "stream": "stream_045", "id": 15}
  ```

## MQTT status message

Every 20 seconds and when a variable changes, the controller will send a status of its variables to the frontend over the `controller/status` topic. This is to make sure that the frontend is always up-to-date with the controller.

Here's an example of the message that the controller sends over that MQTT topic:

```json
{
  "status": "stop",
  "pause": true,
  "ontime": "08:00-18:00",
  "active_stream": null,
  "active": {
    "media_id": null
  },
  "media": [
    {
      "id": 1,
      "name": "1. Running Pikachu",
      "category": "gif",
      "description": "description_Running Pikachu"
    },
    {
      "id": 2,
      "name": "2. Vives",
      "category": "gif",
      "description": "description_AAAAVives"
    },
    {
      "id": 3,
      "name": "3. Qatar",
      "category": "gif",
      "description": "description_ABDULpls"
    },
    {"..."}
  ]
}
```
