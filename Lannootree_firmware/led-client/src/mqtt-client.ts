import fs from 'fs'
import mqtt from 'mqtt'
import dotenv from 'dotenv'
import * as handel from './mqtt-handles.js'

dotenv.config({ path: '../.env' });

class LannooTreeMqttClient {

  private client: mqtt.Client;
  private caCert: Buffer = fs.readFileSync('./ca.crt');
  private mqttOptions: mqtt.IClientOptions = {
    clientId: `led-client${Math.random().toString().substring(2, 8)}`,
    port: Number(process.env.MQTT_BROKER_PORT),
    host: process.env.MQTT_BROKER_URL,
    protocol: 'mqtts',
    rejectUnauthorized: true,
    ca: this.caCert,
    will: {
      qos: 2,
      topic: 'status/led-client',
      payload: 'Offline',
      retain: true
    }
  };

  private subscribeTopics = [
    'ledpanel/control',
  ];

  private messageTopicMap: Map<string, Map<string, (data: any) => void>> = new Map([
    [ // Topics
      "ledpanel/control",
      new Map( 
      [ // Commands for ledpanel/controll topic
        ["pause", handel.pause_leds],
        ["play",  handel.play_leds],
        ["stop",  handel.stop_leds],
        ["gif",   handel.play_gif],
        ["color", handel.set_color],
      ])
    ]
  ]);

  constructor() {
    this.client = mqtt.connect(this.mqttOptions);
    this.client.on('connect', this.connectCallback);
  }

  log = (message: string, debug: boolean = false) => {
    if (!debug) this.client.publish('logs/led-client', message); 
    console.log(message);
  };

  private subscribeToTopics = () => {
    this.subscribeTopics.forEach(topic => this.client.subscribe(topic));
  };

  private connectCallback = () => {
    this.log('Connected to mqtt');
    this.subscribeToTopics();
    this.client.publish('status/led-client', 'Online', { retain: true });
    this.client.on('error', this.errorCallback);
    this.client.on('message', this.messageCallback);
  };

  private errorCallback = (error: Error) => {
    console.log(`ERROR mqtt: ${error}`);
  };

  private messageCallback = (topic: string, message: Buffer) => {
    let data = JSON.parse(message.toString());
    
    if (this.messageTopicMap.has(topic)) {
      let topicMap = this.messageTopicMap.get(topic);

      if (topicMap?.has(data.command)) {
        let command = topicMap.get(data.command);
        if (command !== undefined) command(data);
      }
    }
  };

}

export const client = new LannooTreeMqttClient();
