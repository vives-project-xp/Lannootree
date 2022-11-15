import Color from './color.js';
import MatrixParser  from './matrixParser.js';
import LedDriver from './driver-connection.js';

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
  client.publish('status/led-client', 'Online', {retain: true});
  client.subscribe("ledpanel/control");
});

client.on('error', function(error) {
  logging("ERROR: mqtt:  " + error);
});

var activeStreamTopic = null;
client.on('message', function (topic, message) {
  let data = message;
  try {
    data = JSON.parse(message.toString());
  } catch (error) {
    data = message;
  }
  switch (topic) {
    case "ledpanel/control":
      switch(data.command) {
        case "pause": pause_leds(); break;
        case "play": play_leds(); break;
        case "stop": stop_leds(); break;
        case "color": set_color(data.red, data.green, data.blue); break;
        case "stream": play_stream(data.stream); break;
      }
      break;
    case "ledpanel/stream": devCheck.Update(data); break;
    case activeStreamTopic:
      leddriver.frame_to_ledcontroller(data);
      break;
  }
  
});

function pause_leds() {
  console.log("LED client paused leds");
}

function play_leds() {
  console.log("LED client resumed leds");
}

function stop_leds() {
  console.log("LED client stopped leds");
}

function set_color(red, green, blue) {
  console.log(`LED client set color (${red},${green},${blue})`);
}

function play_stream(streamID) {
  if(activeStreamTopic != null) client.unsubscribe(activeStreamTopic);
  activeStreamTopic = streamID;
  client.subscribe(streamID);
  console.log(`LED client subscribed to "${streamID}"`);
}

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