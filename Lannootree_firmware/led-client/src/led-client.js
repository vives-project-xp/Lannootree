import Color from './color.js';
import MatrixParser  from './matrixParser.js';
import LedDriver from './led-driver.js';

import mqtt from "mqtt";
import fs from "fs";
import dotenv from "dotenv";
dotenv.config({ path: '../.env' });

const debug = false;
const leddriver_connection = false;
const framerate = 30;
const frontend_framerate = 10;

// Socket client
const leddriver = new LedDriver(leddriver_connection);

// MQTT______________________________________________________________
var caFile = fs.readFileSync("ca.crt");
var options = {
  clientId:"led-client" + Math.random().toString(16).substring(2, 8),
  port: process.env.MQTT_BROKER_PORT,
  host: process.env.MQTT_BROKER_URL,
  protocol:'mqtts',
  rejectUnauthorized : true,
  ca:caFile,
  will: {
      topic: "status/led-client",
      payload: "Offline",
      retain: true
  }
};
const client = mqtt.connect(options);


client.on('connect', function () {
  logging("INFO: mqtt connected");
  client.publish('status/controller', 'Online', {retain: true});
});

client.on('error', function(error) {
  logging("ERROR: mqtt:  " + error);
});

client.on('message', function (topic, message) {
 
});


// Live update__________________________________________________________________________
// function PushMatrix() {
//   switch (status) {
//     case "effect":
//       ledmatrix = effect_manager.get_currentmatrix();
//       break;
//     case "asset":
      
//       break;
  
//     default:
//       break;
//   }
//   leddriver.frame_to_ledcontroller(ledmatrix);
//   logging(MatrixParser.frame_to_string(ledmatrix), true);
// }

// function PushMatrix_frontend() {
//   let response = JSON.stringify(MatrixParser.frame_to_json(ledmatrix));
//   client.publish('lannootree/out', response);
// }

// setInterval(() => {PushMatrix()}, (Math.round(1000/framerate)));
// setInterval(() => {PushMatrix_frontend()}, (Math.round(1000/frontend_framerate)));

// general__________________________________________________________________
function logging(message, msgdebug = false) {
  if (!msgdebug) {
    console.log(message);
    client.publish('logs/controller', message);
  }
  else if(msgdebug && debug) {
    console.log(message);
  }
}

function crashApp(message) {
  client.publish('logs/controller', 'FATAL: ' + message, (error) => {
    process.exit(1);
  })
}