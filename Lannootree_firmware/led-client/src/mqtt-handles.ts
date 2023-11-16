import fs from 'fs'
import mqtt from 'mqtt'
import streamPlayer from './stream-player.js'
import { ledDriver } from './driver-connection.js'
import { gifPlayer } from './temporary/gif-player.js'

const config = JSON.parse(fs.readFileSync('./config.json').toString());

export function pause_leds() {
  streamPlayer.pause();
}

export function play_leds() {
  streamPlayer.play();
}

export function stop_leds() {
  streamPlayer.stop();
}

export function set_color(data: any) {
  streamPlayer.stop();


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

export function play_stream(mqtt_client: mqtt.Client, currentStreamID: string | null, data: any) {
  if (currentStreamID != null) {
    mqtt_client.unsubscribe(process.env.TOPIC_PREFIX + `ledpanel/stream/${currentStreamID}`)
    currentStreamID = null;
  }

  currentStreamID = data.stream;
  console.log(`Listening on stream: ${currentStreamID}`)
  mqtt_client.subscribe(process.env.TOPIC_PREFIX + `ledpanel/stream/${currentStreamID}`);

  streamPlayer.start();
}
