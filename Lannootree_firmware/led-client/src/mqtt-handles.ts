import fs from 'fs'
import { ledDriver } from './driver-connection.js'
import { gifPlayer } from './temporary/gif-player.js'

const config = JSON.parse(fs.readFileSync('./config.json').toString());

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
  gifPlayer.stop();

  let cString = new Array<number>(config.channels.CA0.ledCount * 3);
  
  for (let i = 0; i < cString.length; i += 3) {
    cString[i + 0] = data.red;
    cString[i + 1] = data.green;
    cString[i + 2] = data.blue;
  }

  ledDriver.frame_to_ledcontroller(cString);
}

export function change_config(data: any) {
  fs.writeFileSync('./config.json', data);
}

// var activeStreamTopic: string | null = null;

// export function play_stream(streamID: string, client: MqttClient) {
//   if(activeStreamTopic != null) client.unsubscribe(activeStreamTopic);
//   activeStreamTopic = streamID;
//   client.subscribe(streamID);
//   console.log(`LED client subscribed to "${streamID}"`);
// }
