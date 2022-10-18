import Color from './color.js';
import EffectManager from "./effect_manager.js";
import JsonGenerator from "./json_generator.js"
import Debug  from './debug.js';
import LedDriver from './led-driver.js';

import mqtt from "mqtt";
import fs from "fs";

import net from "net"
import { serialize } from 'v8';
import dotenv from 'dotenv'

dotenv.config({ path: '../.env' })

const debug = true;
const leddriver_connection = false;
const framerate = 30;

// Socket client
const leddriver = new LedDriver(leddriver_connection);

// MQTT
var caFile = fs.readFileSync("ca.crt");
var options={
  clientId:"controller" + Math.random().toString(16).substring(2, 8),
  port: process.env.MQTT_BROKER_PORT,
  host: process.env.MQTT_BROKER_URL,
  protocol:'mqtts',
  rejectUnauthorized : true,
  ca:caFile,
  will: {
      topic: "status/controller",
      payload: "Offline",
      retain: true
  }
}
const client = mqtt.connect(options);

client.on('connect', function () {
  logging("INFO: mqtt connected");
  client.publish('status/controller', 'Online', {retain: true});
  client.subscribe("controller/pause");
  client.subscribe("controller/stop");
  client.subscribe("controller/setcolor");
  client.subscribe("controller/effect");
  client.subscribe("controller/asset");
  client.subscribe("controller/config");
  sendStatus();
})

client.on('message', function (topic, message) {
  var data = message;
  try {
    data = JSON.parse(message.toString());
  } catch (error) {
    data = message;
  }

  switch (topic) {
    case "controller/pause":
      pause(data.value);
      break;
    case "controller/stop":
      stop();
      break;
    case "controller/setcolor":
      set_color_full(data.red, data.green, data.blue);
      break;
    case "controller/effect":
      play_effect(data.effect_id);
      break;
    case "controller/asset":
      logging("ASSET", true);
      break;
    case "controller/config":
      fs.writeFileSync('../config.json', JSON.stringify(JSON.parse(message), null, 2));
      logging("WARNING: overwriting old json config file");
      updateMatrixFromFile();
      sendStatus();
      break;
    default:
      logging("INFO: MQTT Unknown topic: " + topic, true);
  }
  sendStatus();
})

// CONTROLLER-------------------------------------------------------------------------------------

const manager = new EffectManager();

var ledmatrix = [];
var status = "stop"
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
  let obj = JsonGenerator.statusToJson(
    get_matrixsize(),
    status,
    paused,
    activeData,
    manager.get_current_effect(),
    manager.get_effects(),
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
      manager.pause();
      sendStatus();
      break;
    case "play":
      paused = false;
      if(status == "effect")manager.run(speed_modifier);
      sendStatus();
      break;
    case "toggle":
      if(paused) pause("play");
      else pause("pause")
      break;
    default:
      break;
  }
}

function stop(){
  status = "stop";
  manager.stop();
  set_color_full(0,0,0);
  activeData = null;
}

function set_color_full(red, green, blue) {
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
}

function play_effect(effect) {
  if(manager.has_effect(effect)) {
    pause("play");
    status = "effect"
    manager.set_effect(effect, get_matrixsize(), speed_modifier);
  }
}

function PushMatrix() {
  switch (status) {
    case "effect":
      ledmatrix = manager.get_currentmatrix();
      break;
    case "asset":
      
      break;
  
    default:
      break;
  }
  leddriver.frame_to_ledcontroller(ledmatrix);
  logging(Debug.frame_to_string(ledmatrix), true)
}
setInterval(() => {PushMatrix()}, (Math.round(1000/framerate)));

// general__________________________________________________________________
function logging(message, msgdebug = false){
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