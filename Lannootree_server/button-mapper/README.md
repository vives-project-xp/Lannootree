# Button mapper

The `button-mapper` is kinda `deprecated` now in this project, but can still be used. It was brought to life when we were asked to make a [physical controller](../../Lannootree_hardware/README.md) for the Lannootree. That controller was an ESP32 that sent commands over MQTT to the [controller](../controller/README.md). The button-mapper maps the MQTT commands for each button to the MQTT commands of the controller.

## Why its deprecated?

The ESP sent commands over the topic `controller/in` with the `command: play_effect` and an `effect_name`. The commands stop/pause/play/previous_effect/next_effect were also possible under this topic. At that time, the storage wasn't there yet. The controller just stored a random counter called 'current_gif' from 0 to 20. This number was then sent to the led-client that played its pre-processed gif matching that number. This can be fixed by sending following over MQTT instead of "play_effect":

```json
{"command": "play_media", "media_id": 15}
```

The only problem is that this is "hard-coded" and it isn't guaranteed that the given media_id is still available in the storage. The frontend doesn't have this problem, because only the available media will be shown there to click on.
Also, next/previous can't be called because the controller itself doesn't store 'current_gif' anymore.

A possible fix would for those 2 problems would be to create for example a `give_next_id` function in the storage that returns the next available media_id over MQTT based on the given media_id.
