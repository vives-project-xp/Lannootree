import { MqttClient } from 'mqtt'
import LedDriver from './driver-connection.js'

const USE_LEDDRIVER_CONNETION = false;
const leddriver = new LedDriver(USE_LEDDRIVER_CONNETION);

export function pause_leds() {
  console.log("LED client paused leds");
}

export function play_leds() {
  console.log("LED client resumed leds");
}

export function stop_leds() {
  console.log("LED client stopped leds");
}

export function set_color(red: number, green: number, blue: number) {
  console.log(`LED client set color (${red},${green},${blue})`);
}

export function play_gif(gif_number: number) {
  console.log(`LED client play gif ${gif_number}`);
}

var activeStreamTopic: string | null = null;

export function play_stream(streamID: string, client: MqttClient) {
  if(activeStreamTopic != null) client.unsubscribe(activeStreamTopic);
  activeStreamTopic = streamID;
  client.subscribe(streamID);
  console.log(`LED client subscribed to "${streamID}"`);
}

