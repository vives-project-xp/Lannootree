import JsonGenerator from "./json_generator.js";
import DevCheck from './dev.js';

import mqtt from "mqtt";
import fs from "fs";
import dotenv from "dotenv";
dotenv.config({ path: '../.env' });

const debug = false;
const framerate = process.env.CONTROLLER_FRAMERATE;
const frontend_framerate = process.env.CONTROLLER_FRONTEND_FRAMERATE;
var production_server = process.env.PRODUCTION_SERVER
const developement_time = process.env.CONTROLLER_DEV_SECONDS;

var instanceName = "controller";
if (typeof production_server == 'undefined') {
  production_server = false;
  instanceName = "controller-dev";
}
const devCheck = new DevCheck(production_server, developement_time);

// MQTT______________________________________________________________
var caFile = fs.readFileSync("./ca.crt");
var options = {
  clientId:"controller" + Math.random().toString(16).substring(2, 8),
  port: process.env.MQTT_BROKER_PORT,
  host: process.env.MQTT_BROKER_URL,
  protocol:'mqtts',
  rejectUnauthorized : true,
  ca:caFile,
  will: {
      topic: "status/" + instanceName,
      payload: "Offline",
      retain: true
  }
};
const client = mqtt.connect(options);

const topics = [
  "controller/in"
]

client.on('connect', function () {
  logging("INFO: mqtt connected");
  client.subscribe("status/controller-dev");
  
  devCheck.on('startup', () => {
    topics.forEach(topic => {
      client.subscribe(topic);
    });
    client.publish("status/" + instanceName, 'Online', {retain: true});
    logging("INFO: controller started")
    sendStatus();
  });
  
  devCheck.on('sleep', () => {
    client.publish("status/" + instanceName, 'Sleep', {retain: true});
    topics.forEach(topic => {
      client.unsubscribe(topic);
    });
    logging("WARNING: a dev controller started, going to sleep mode")
  });
  
  devCheck.on('timer', () => {
    client.publish("status/" + instanceName, 'Starting', {retain: true});
    logging(`INFO: dev controller went offline, starting in ${developement_time} seconds`)
  });

  devCheck.Start();
});

client.on('error', function(error) {
  logging("ERROR: mqtt:  " + error);
});

client.on('message', function (topic, message) {
  let data = message;
  try {
    data = JSON.parse(message.toString());
  } catch (error) {
    data = message;
  }
  
  switch (topic) {
    case "controller/in":
      switch(data.command) {
        case "pause": pause_leds(); break;
        case "play": play_leds(); break;
        case "stop": stop_leds(); break;
        case "color": set_color(data.red, data.green, data.blue); break;
        case "show_media": set_media(data.media_name); break;
        // case "play_effect": set_effect(data.effect_name); break;
        case "play_effect": play_gif(data.effect_name); break;
      }
    case "status/controller-dev": devCheck.Update(data); break;
  }
  if (topic == "status/" + instanceName  && message == "restart") {
    crashApp("restarted via mqtt command");
  }
});

// CONTROLLER______________________________________________________________

var status = "stop";
var activeData = null;
var activeStream = null;

var paused = true;  // later opvragen aan ledclient, niet lokaal bijhouden
var playing_gif = 0;  // Later ook verwijderen

function pause_leds() {
  client.publish('ledpanel/control', JSON.stringify({"command": "pause"}));
  status = "pause";
  paused = true;
  sendStatus();
  logging("INFO: LEDS paused");
}

function play_leds() {
  client.publish('ledpanel/control', JSON.stringify({"command": "play"}));
  status = "playing";
  paused = false;
  sendStatus();
  logging("INFO: LEDS resumed");
}

function stop_leds() {
  client.publish('ledpanel/control', JSON.stringify({"command": "stop"}));
  status = "stop";
  activeData = null;
  activeStream = null;
  paused = true;
  playing_gif = null;
  sendStatus();
  logging("INFO: stopped media");
}

function set_color(red, green, blue) {
  client.publish('ledpanel/control', JSON.stringify({"command": "color", "red": red, "green": green, "blue": blue}));
  activeData = "(" + red + "," + green + "," + blue + ")";
  sendStatus();
  logging(`INFO: static color (${red},${green},${blue}) set`);
}

function play_gif(gif_number) {
  // Check storage if media (media_name) is ready
  activeData = "gif_" + gif_number;
  activeStream = null;
  client.publish('ledpanel/control', JSON.stringify({"command": "gif", "gif_number": gif_number}));
  playing_gif = gif_number;
  sendStatus();
  logging(`INFO: playing gif ${gif_number}`);
}

function set_media(media_name) {
  // Check storage if media (media_name) is ready
  activeData = media_name;
  let streamID = generateStreamID();
  activeStream = streamID;
  client.publish('ledpanel/control', JSON.stringify({"command": "stream", "stream": `stream_${streamID}`}));
  sendStatus();
  logging(`INFO: playing media (${media_name})`);
}

function set_effect(effect_name) {
  // Check storage if effect (effect_name) is ready
  activeData = effect_name;
  let streamID = generateStreamID();
  activeStream = streamID;
  client.publish('ledpanel/control', JSON.stringify({"command": "stream", "stream": `stream_${streamID}`}));
  sendStatus();
  logging(`INFO: playing effect (${effect_name})`);
}

var currentID = 0;
function generateStreamID() {
  function padLeft(nr, n, str){
    return Array(n-String(nr).length+1).join(str||'0')+nr;
  }
  if(currentID == 999) currentID = 0;
  currentID++;
  return padLeft(currentID,3);
}

// function updateMatrixFromFile() {
//   fs.readFile('../config.json', (err, data) => {
//     if (err) throw err;
//     let json_data = JSON.parse(data);
//     set_matrixsize(json_data.dimentions.row,json_data.dimentions.col);
//   });
// }

// updateMatrixFromFile();

// function set_matrixsize(rows, columns) { // this needs to reinitiate the effect_controller (create a new object)
//   if(!isNaN(rows) && !isNaN(columns)) {
//     stop();
//     ledmatrix = Array.from(Array(Math.abs(rows)), () => new Array(Math.abs(columns)));
//     for(var i = 0; i < ledmatrix.length; i++) {
//       for(var j = 0; j < ledmatrix[i].length; j++) {
//         ledmatrix[i][j] = new Color(0,0,0);
//       }
//     }
//     logging(`NEW MATRIX SIZE: \tROWS: ${Math.abs(rows)}, COLUMNS: ${Math.abs(columns)}`, true);
//   }
// }

function sendStatus() {
  let obj = JsonGenerator.statusToJson(
    status,
    activeData,
    activeStream,
    paused,
    playing_gif,
    [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]   // totally DRY
  );
  client.publish('controller/status', JSON.stringify(obj));
}

// function get_matrixsize() {
//   let rows = 0;
//   let cols = 0;
//   if(ledmatrix.length != 0) {
//     cols = ledmatrix[0].length;
//     for(var i = 0; i < ledmatrix.length; i++) rows++;
//   }
//   return [rows, cols];
// }

// function pause(type) {
//   switch (type) {
//     case "pause":
//       paused = true;
//       effect_manager.pause();
//       sendStatus();
//       logging("INFO: controller paused");
//       break;
//     case "play":
//       paused = false;
//       if(status == "effect") effect_manager.run(speed_modifier);
//       sendStatus();
//       logging("INFO: controller resumed");
//       break;
//     case "toggle":
//       if(paused) pause("play");
//       else pause("pause");
//       break;
//     default:
//       break;
//   }
// }

// function stop() {
//   status = "stop";
//   effect_manager.stop();
//   set_color_full(0,0,0);
//   activeData = null;
//   sendStatus();
//   logging("INFO: clearing all leds (stop)");
// }

// function set_color_full(red, green, blue) {
//   if(status != "color") logging("INFO: status changed to static color(s)");
//   status = "color";
//   effect_manager.stop();
//   activeData = {color: [red, green, blue]};
//   if(!isNaN(red) && !isNaN(green) && !isNaN(blue)) {
//     if(red<=255 && green<=255 && blue<=255 && red>=0 && green>=0 && blue>=0) {
//       for(var i = 0; i < ledmatrix.length; i++) {
//         for(var j = 0; j < ledmatrix[i].length; j++) {
//           ledmatrix[i][j].set_color(red, green, blue);
//         }
//       }
//     }
//   }
//   sendStatus();
// }

// function play_effect(effect_id) {
//   if(effect_manager.has_effect(effect_id)) {
//     pause("play");
//     status = "effect";
//     effect_manager.set_effect(effect_id, get_matrixsize(), speed_modifier);
//     sendStatus();
//     logging("INFO: Set effect:" + effect_id);
//   }
// }

// function set_fade(fade) {
//   if(status = "effect") effect_manager.set_fade(fade);
//   sendStatus();
//   logging("INFO: set fade:" + fade);
// }

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
//   logging(MatrixParser.frame_to_string(ledmatrix), true);
//   // client.publish('lannootree/processor/out', response);
// }

// function PushMatrix_frontend() {
//   if (devCheck.Online()) {
//     let response = JSON.stringify(MatrixParser.frame_to_json(ledmatrix));
//     client.publish('lannootree/out', response);
//   }
// }

// setInterval(() => {PushMatrix()}, (Math.round(1000/framerate)));
// setInterval(() => {PushMatrix_frontend()}, (Math.round(1000/frontend_framerate)));

// general__________________________________________________________________
function logging(message, msgdebug = false) {
  if (!msgdebug) {
    console.log(message);
    client.publish('logs/' + instanceName, message);
  }
  else if(msgdebug && debug) {
    console.log(message);
  }
}

function crashApp(message) {
  console.log('FATAL: ' + message);
  client.publish('logs/' + instanceName, 'FATAL: ' + message, (error) => {
    process.exit(1);
  })
}