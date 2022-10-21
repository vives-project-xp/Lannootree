import Color from './color.js';
import EffectManager from "./effect_manager/effect_manager.js";
import JsonGenerator from "./json_generator.js"
import MatrixParser  from './matrixParser.js';
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


var statusTopic = "status/controller";
if (typeof production_server == 'undefined') {
  production_server = false;
  statusTopic = "status/controller-dev";
}
const devCheck = new DevCheck(production_server, developement_time);

// MQTT______________________________________________________________
var caFile = fs.readFileSync("ca.crt");
var options = {
  clientId:"controller" + Math.random().toString(16).substring(2, 8),
  port: process.env.MQTT_BROKER_PORT,
  host: process.env.MQTT_BROKER_URL,
  protocol:'mqtts',
  rejectUnauthorized : true,
  ca:caFile,
  will: {
      topic: statusTopic,
      payload: "Offline",
      retain: true
  }
};
const client = mqtt.connect(options);

const topics = [
  "controller/pause",
  "controller/stop",
  "controller/setcolor",
  "controller/effect",
  "controller/fade",
  "controller/asset",
  "controller/config"
]

client.on('connect', function () {
  logging("INFO: mqtt connected");
  client.subscribe("status/controller-dev");
  
  devCheck.on('startup', () => {
    topics.forEach(topic => {
      client.subscribe(topic);
    });
    client.publish(statusTopic, 'Online', {retain: true});
    logging("INFO: controller started")
    sendStatus();
  });
  
  devCheck.on('sleep', () => {
    client.publish(statusTopic, 'Sleep', {retain: true});
    topics.forEach(topic => {
      client.unsubscribe(topic);
    });
    logging("WARNING: a dev controller started, going to sleep mode")
  });
  
  devCheck.on('timer', () => {
    client.publish(statusTopic, 'Starting', {retain: true});
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
    case "status/controller-dev": devCheck.Update(data); break;
    case "controller/pause": pause(data.value); break;
    case "controller/stop": stop(); break;
    case "controller/setcolor": set_color_full(data.red, data.green, data.blue); break;
    case "controller/effect": play_effect(data.effect_id); break;
    case "controller/fade": set_fade(data.fade); break;
    case "controller/asset": logging("ASSET", true); break;
    case "controller/config":
      fs.writeFileSync('../../config.json', JSON.stringify(JSON.parse(message), null, 2));
      logging("WARNING: overwriting old json config file");
      updateMatrixFromFile();
      break;
  }
});

// CONTROLLER______________________________________________________________
const effect_manager = new EffectManager();

var ledmatrix = [];
var status = "stop";
var activeData = null; // change back to color
var paused = false;
var speed_modifier = 1;

function updateMatrixFromFile() {
  fs.readFile('../config.json', (err, data) => {
    if (err) throw err;
    let json_data = JSON.parse(data);
    set_matrixsize(json_data.dimentions.row,json_data.dimentions.col);
  });
}

updateMatrixFromFile();

function set_matrixsize(rows, columns) { // this needs to reinitiate the effect_controller (create a new object)
  if(!isNaN(rows) && !isNaN(columns)) {
    stop();
    ledmatrix = Array.from(Array(Math.abs(rows)), () => new Array(Math.abs(columns)));
    for(var i = 0; i < ledmatrix.length; i++) {
      for(var j = 0; j < ledmatrix[i].length; j++) {
        ledmatrix[i][j] = new Color(0,0,0);
      }
    }
    logging(`NEW MATRIX SIZE: \tROWS: ${Math.abs(rows)}, COLUMNS: ${Math.abs(columns)}`, true);
  }
}

function sendStatus() {
  let fade = false;
  if(status == "effect") fade = effect_manager.get_fade();
  let obj = JsonGenerator.statusToJson(
    get_matrixsize(),
    status,
    paused,
    activeData,
    fade,
    effect_manager.get_current_effect(),
    effect_manager.get_effects(),
    "null", // current_asset
    [// assets
      "random1.png",
      "cat.jpg"
    ] 
  );
  client.publish('controller/status', JSON.stringify(obj));
}

function get_matrixsize() {
  let rows = 0;
  let cols = 0;
  if(ledmatrix.length != 0) {
    cols = ledmatrix[0].length;
    for(var i = 0; i < ledmatrix.length; i++) rows++;
  }
  return [rows, cols];
}

function pause(type) {
  switch (type) {
    case "pause":
      paused = true;
      effect_manager.pause();
      sendStatus();
      logging("INFO: controller paused");
      break;
    case "play":
      paused = false;
      if(status == "effect") effect_manager.run(speed_modifier);
      sendStatus();
      logging("INFO: controller resumed");
      break;
    case "toggle":
      if(paused) pause("play");
      else pause("pause");
      break;
    default:
      break;
  }
}

function stop() {
  status = "stop";
  effect_manager.stop();
  set_color_full(0,0,0);
  activeData = null;
  sendStatus();
  logging("INFO: clearing all leds (stop)");
}

function set_color_full(red, green, blue) {
  if(status != "color") logging("INFO: status changed to static color(s)");
  status = "color";
  effect_manager.stop();
  activeData = {color: [red, green, blue]};
  if(!isNaN(red) && !isNaN(green) && !isNaN(blue)) {
    if(red<=255 && green<=255 && blue<=255 && red>=0 && green>=0 && blue>=0) {
      for(var i = 0; i < ledmatrix.length; i++) {
        for(var j = 0; j < ledmatrix[i].length; j++) {
          ledmatrix[i][j].set_color(red, green, blue);
        }
      }
    }
  }
  sendStatus();
}

function play_effect(effect_id) {
  if(effect_manager.has_effect(effect_id)) {
    pause("play");
    status = "effect";
    effect_manager.set_effect(effect_id, get_matrixsize(), speed_modifier);
    sendStatus();
    logging("INFO: Set effect:" + effect_id);
  }
}

function set_fade(fade) {
  if(status = "effect") effect_manager.set_fade(fade);
  sendStatus();
  logging("INFO: set fade:" + fade);
}

// Live update__________________________________________________________________________
function PushMatrix() {
  switch (status) {
    case "effect":
      ledmatrix = effect_manager.get_currentmatrix();
      break;
    case "asset":
      
      break;
  
    default:
      break;
  }
  logging(MatrixParser.frame_to_string(ledmatrix), true);
  // client.publish('lannootree/processor/out', response);
}

function PushMatrix_frontend() {
  if (devCheck.Online()) {
    let response = JSON.stringify(MatrixParser.frame_to_json(ledmatrix));
    client.publish('lannootree/out', response);
  }
}

setInterval(() => {PushMatrix()}, (Math.round(1000/framerate)));
setInterval(() => {PushMatrix_frontend()}, (Math.round(1000/frontend_framerate)));

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