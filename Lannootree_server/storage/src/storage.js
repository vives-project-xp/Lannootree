import dotenv from 'dotenv';
import mqtt from "mqtt";
import * as fs from 'fs';

dotenv.config({ path: '../.env' })

// MQTT ______________________________________________________________________________________

var caFile = fs.readFileSync("ca.crt");
var clientcrt = fs.readFileSync("client.crt");
var clientkey = fs.readFileSync("client.key");
var options={
  clientId:"storage_" + Math.random().toString(16).substring(2, 8),
  port: process.env.MQTT_BROKER_PORT,
  host: process.env.MQTT_BROKER_URL,
  protocol:'mqtts',
  rejectUnauthorized : true,
  ca:caFile,
  cert: clientcrt,
  key: clientkey,
    will: {
        topic: "status/storage",
        payload: "Offline",
        retain: true
    }
};
const client = mqtt.connect(options);

client.on('connect', function () {
    logging("[INFO] mqtt connected")
    client.publish('status/storage', 'Online', {retain: true});
});

function logging(message, msgdebug = false){
    if (!msgdebug) {
        console.log(message);
        client.publish('logs/storage', message);
    }
    else if(msgdebug && debug) {
        console.log(message);
    }
}