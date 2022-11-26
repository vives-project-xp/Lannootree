import fs from 'fs'
import net from 'net'
import mqtt from 'mqtt'
import dotenv from 'dotenv'
import process from 'process'
import * as handel from './mqtt-handles.js'

dotenv.config({ path: '../.env' });

class LannooTreeMqttClient {

  private driverSocket: net.Socket = new net.Socket();

  private client: mqtt.Client;
  private caCert: Buffer = fs.readFileSync('./ca.crt');
  private clientcrt = fs.readFileSync("client.crt");
  private clientkey = fs.readFileSync("client.key");

  private mqttOptions: mqtt.IClientOptions = {
    clientId: `led-client_${Math.random().toString().substring(2, 8)}`,
    port: Number(process.env.MQTT_BROKER_PORT),
    host: process.env.MQTT_BROKER_URL,
    protocol: 'mqtts',
    rejectUnauthorized: true,
    ca: this.caCert,
    cert: this.clientcrt,
    key: this.clientkey,
    will: {
      qos: 2,
      topic: 'status/led-client',
      payload: 'Offline',
      retain: true
    }
  };

  private subscribeTopics = [
    'ledpanel/control',
    'controller/config'
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
    ], 
    [
      'controller/config',
      new Map([
        ["config", handel.change_config]
      ])
    ]
  ]);

  constructor() {
    this.client = mqtt.connect(this.mqttOptions);
    this.client.on('connect', this.connectCallback);
  }

  send(topic: string, msg: string) {
    this.client.publish(topic, msg);
  }

  log = (message: string, debug: boolean = false) => {
    if (!debug) this.client.publish('logs/led-client', message); 
    console.log(message);
  };

  private subscribeToTopics = () => {
    this.subscribeTopics.forEach(topic => this.client.subscribe(topic));
  };

  private connectCallback = () => {
    this.log('[INFO] connected to mqtt');
    
    process.on('SIGTERM', () => {
      this.client.publish('status/led-driver', 'Offline', { retain: true });
    });

    this.driverSocket = net.createConnection('/var/run/logging.socket');

    this.driverSocket.on('connect', () => {
      this.log("[INFO] Connected to led-driver");
      this.client.publish('status/led-driver', 'Online', { retain: true });
    });

    this.driverSocket.on('end', () => {
      this.log("[INFO] Connection to led-driver-log ended");
      this.client.publish('status/led-driver', 'Offline', { retain: true });
    });

    this.driverSocket.on('data', (data) => {
      let dataString = data.toString();
      let dataStrings = dataString.split('\n');

      dataStrings.forEach((msg) => {
        this.client.publish('logs/led-driver', msg);
      });
    });

    this.driverSocket.on('error', (err) => {
      this.log("[ERROR] connecting to led-driver-logging");
    });

    this.subscribeToTopics();

    this.client.publish('status/led-client', 'Online', { retain: true });
    this.client.on('error', this.errorCallback);
    this.client.on('message', this.messageCallback);
  };

  private errorCallback = (error: Error) => {
    this.log(`[ERROR] mqtt: ${error}`);
  };

  private messageCallback = (topic: string, message: Buffer) => {
    let data = JSON.parse(message.toString());
    
    if (this.messageTopicMap.has(topic)) {
      let topicMap = this.messageTopicMap.get(topic);

      if (topicMap?.has(data.command)) {
        let command = topicMap.get(data.command);
	console.log(command);
        if (command !== undefined) command(data);
      }

      else if (topic == 'controller/config') {
        let command = topicMap?.get('config');
        if (command !== undefined) command(data);
      }
    }
  };

}

export const client = new LannooTreeMqttClient();
