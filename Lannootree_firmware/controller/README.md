# Controller

## MQTT connection with CLIENT-API

`togglepause/pause/start`

```js
client.publish('controller/pause', JSON.stringify({"value": "togglepause"}));
client.publish('controller/pause', JSON.stringify({"value": "pause"}));
client.publish('controller/pause', JSON.stringify({"value": "start"}));
```

`stop`

```js
client.publish('controller/stop', JSON.stringify({"value": "stop"}));   // message maakt niet uit, luistert gewoon naar topic 'stop'
```

`setcolor`

```js
client.publish('controller/setcolor', JSON.stringify({"red": 10, "green": 20, "blue": 30}));
```

`effect`

```js
client.publish('controller/effect', JSON.stringify({"effect_id": "random_full"}));
```

## MQTT status message

```json
{
  "matrix": {
    "rows": 18,
    "cols": 18
  },
  "pause": "false",
  "status": "effect",
  "current_effect": null,
  "effects": [
    "random_full",
    "random_each"
  ],
  "current_asset": null,
  "assets": [
    "random1.png",
    "cat.jpg"
  ],
  "color": null
}
```
