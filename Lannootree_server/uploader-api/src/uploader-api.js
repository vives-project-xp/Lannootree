import dotenv from 'dotenv';
import express from 'express';
import mqtt from "mqtt";
import * as fs from 'fs';

dotenv.config({ path: '../.env' });

// MQTT ______________________________________________________________________________________

var caFile = fs.readFileSync("ca.crt");
var options={
  clientId:"clientapi" + Math.random().toString(16).substring(2, 8),
  port: process.env.MQTT_BROKER_PORT,
  host: process.env.MQTT_BROKER_URL,
  protocol:'mqtts',
  rejectUnauthorized : true,
  ca:caFile,
    will: {
        topic: "voronoi/in",
        payload: "Offline",
        retain: true
    }
};
const client = mqtt.connect(options);

const app = express();

client.on('connect', function () {
    logging("INFO: mqtt connected for voronoi")
    client.publish('status/client-api', 'Online', {retain: true});

    client.subscribe('voronoi/in');
});


app.post('/uploader-api', (req, res) => {
    console.log('you reached the uploader-api');
});

app.post('/uploader-api/in', (req, res) => {
    console.log('you reached the uploader-api');
    client.on(message)
});


function logging(message, msgdebug = false){
    if (!msgdebug) {
      console.log(message);
      client.publish('logs/status', message);
    }
    else if(msgdebug && debug) {
      console.log(message);
    }
  }


  app.listen(process.env.PORT, () =>
  console.log(`Example app listening on port ${process.env.PORT}!`),
);  