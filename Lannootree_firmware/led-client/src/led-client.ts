import dotenv from 'dotenv'
import createMqttClient from './mqtt-client.js'

dotenv.config({ path: '../.env' });

const FRAMERATTE = 30;
const FRONTEND_FRAMERATE = 10;

const { client, logging } = createMqttClient();

logging('Led client started', false);
