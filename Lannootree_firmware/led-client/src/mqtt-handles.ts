import { MqttClient } from 'mqtt'
import { gifPlayer } from './temporary/gif-player.js'

export function pause_leds() {
  gifPlayer.pause();
}

export function play_leds() {
  gifPlayer.play();
}

export function stop_leds() {
  gifPlayer.stop();
}

export function play_gif(data: any) {
  gifPlayer.set_gif(data.gif_number);
}

export function set_color(data: any) {
  console.log(`LED client set color (${data.red},${data.green},${data.blue})`);
}

// var activeStreamTopic: string | null = null;

// export function play_stream(streamID: string, client: MqttClient) {
//   if(activeStreamTopic != null) client.unsubscribe(activeStreamTopic);
//   activeStreamTopic = streamID;
//   client.subscribe(streamID);
//   console.log(`LED client subscribed to "${streamID}"`);
// }
