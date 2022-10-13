# Lannootree firmware

## Controller

### MQTT connection with CLIENT-API

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
client.publish('controller/effect', JSON.stringify({"effect_id": "effect1"}));
```
