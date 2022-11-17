import { MqttClient } from 'mqtt'
import { gifPlayer } from './temporary/gif-player.js'

export function pause_leds() {
  console.log("LED client paused leds");
}

export function play_leds() {
  console.log("LED client resumed leds");
  gifPlayer.start();
}

export function stop_leds() {
  console.log("LED client stopped leds");
  gifPlayer.stop();
}

export function set_color(red: number, green: number, blue: number) {
  console.log(`LED client set color (${red},${green},${blue})`);
}

export function play_gif(gif_number: number) {
  console.log(`LED client play gif ${gif_number}`);
  gifPlayer.set_gif(gif_number);
  gifPlayer.start();
}

var activeStreamTopic: string | null = null;

export function play_stream(streamID: string, client: MqttClient) {
  if(activeStreamTopic != null) client.unsubscribe(activeStreamTopic);
  activeStreamTopic = streamID;
  client.subscribe(streamID);
  console.log(`LED client subscribed to "${streamID}"`);
}

