import dotenv from 'dotenv'
import { client } from './mqtt-client.js'

dotenv.config({ path: '../.env' });

client.log('Led client started');
