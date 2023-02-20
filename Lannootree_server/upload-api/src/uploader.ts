import mqtt from 'mqtt'
import * as fs from 'fs'
import dotenv from 'dotenv'
import * as path from 'path'
import express from 'express'
import { fileURLToPath } from 'url'
import router from './routers/router.js'
import cors from 'cors'

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

dotenv.config({ path: '../../.env' });

const caFile    = fs.readFileSync('ca.crt');
const clientCrt = fs.readFileSync('client.crt');
const clientKey = fs.readFileSync('client.key');

const mqttOptions: mqtt.IClientOptions = {
  clientId: `clientapi${Math.random().toString(16).substring(2, 8)}`,
  port: Number((process.env.MQTT_BROKER_PORT as string)),
  host: process.env.MQTT_BROKER_URL as string,
  protocol: 'mqtts',
  rejectUnauthorized: false,
  ca: caFile,
  cert: clientCrt,
  key: clientKey,
  will: {
    topic: 'status/uploader-api',
    payload: 'Offline',
    retain: true,
    qos: 0
  }
};

const mqttClient = mqtt.connect(mqttOptions);

const app = express();
app.use(cors());
app.use(express.static(path.join(__dirname, 'storage')));
app.use(router);
app.listen(3000, () => {
  console.log('App listening on port 3000');
});

