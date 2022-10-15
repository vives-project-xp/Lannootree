import Color from './color.js';
import EffectManager from "./effect_manager.js";

import mqtt from "mqtt";
import fs from "fs";

import net from "net"
import { serialize } from 'v8';

const debug = false;
const leddriver_connection = false;

// Socket client
const socket = 0;
if(leddriver_connection) socket = net.createConnection("../led_driver/build/dev/lannootree.socket");

// MQTT
var caFile = fs.readFileSync("ca.crt");
var options={
  clientId:"controller" + Math.random().toString(16).substring(2, 8),
  port:8883,
  host:'lannootree.devbitapp.be',
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
  client.subscribe('controller/#');
  sendStatus();
})

client.on('message', function (topic, message) {

  switch (topic) {
    case "controller/pause":
      const json_obj1 = JSON.parse(message.toString());
      if(json_obj1.value == "pause") pause();
      else if(json_obj1.value == "togglepause") togglepause();
      else if(json_obj1.value == "play") play();
      sendStatus();
      break;
    case "controller/stop":
      stop();
      sendStatus();
      break;
    case "controller/setcolor":
      playing_effect = null;
      const json_obj2 = JSON.parse(message.toString());
      set_color_full(json_obj2.red, json_obj2.green, json_obj2.blue);
      frame_to_ledcontroller();
      color = [json_obj2.red, json_obj2.green, json_obj2.blue];
      sendStatus();
      color = null;
      break;
    case "controller/effect":
      const json_obj3 = JSON.parse(message.toString());
      playing_effect = json_obj3.effect_id;
      play_effect();
      sendStatus();
      break;
    case "controller/asset":
      logging("ASSET", true);
      sendStatus();
      break;
    case "controller/config":
      fs.writeFileSync('../config_test.json', message);
      logging("WARNING: overwriting old json config file");
      break;
    default:
      logging("Unknown topic", true);
  }
})

// CONTROLLER

const manager = new EffectManager();

var ledmatrix = [];
var ispaused = true;
var playing_effect = null;
var playing_asset = null;
var color = null;

fs.readFile('../config.json', (err, data) => {
  if (err) throw err;
  let json_data = JSON.parse(data);
  set_matrixsize(json_data.dimentions.row,json_data.dimentions.col);
});

function set_matrixsize(rows, columns) {
  pause();
  if(!isNaN(rows) && !isNaN(columns)) {
    ledmatrix = Array.from(Array(Math.abs(rows)), () => new Array(Math.abs(columns)));
    
    for(var i = 0; i < ledmatrix.length; i++) {
      for(var j = 0; j < ledmatrix[i].length; j++) {
        ledmatrix[i][j] = new Color(0,0,0);
      }
    }
    logging(`NEW MATRIX SIZE: \tROWS: ${Math.abs(rows)}, COLUMNS: ${Math.abs(columns)}`, true);
  }
  
  if(playing_effect != null) play();
}

function sendStatus() {
  let obj = new Object();
  let matrix_obj = new Object();
  let matrixsize = get_matrixsize();
  matrix_obj.rows = matrixsize[0];
  matrix_obj.cols = matrixsize[1];
  obj.matrix = matrix_obj;
  obj.current_effect = playing_effect;
  let effect_obj = manager.get_effects();
  obj.effects = effect_obj;
  obj.current_asset = playing_asset;
  obj.assets = ["random1.png", "cat.jpg"];
  if(ispaused) obj.pause = "true";
  else obj.pause = "false";
  if(ispaused && playing_effect == null && playing_asset == null) obj.stop = "true";
  else obj.stop = "false";
  if(color != null) {
    let color_obj = new Object();
    color_obj.red = color[0];
    color_obj.green = color[1];
    color_obj.blue = color[2];
    obj.color = color_obj;
  }
  else obj.color = null;
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

function pause() {
  ispaused = true;
  sendStatus();
}
function play() {
  ispaused = false;
  sendStatus();
}
function togglepause() {
  ispaused = !ispaused;
  sendStatus();
}

function stop(){
  pause();
  playing_effect = null;
  playing_asset = null;
  set_color_full(0,0,0);
  frame_to_ledcontroller();
  sendStatus();
}

function frame_to_ledcontroller() {
  if(leddriver_connection) {
    let serializedData = [];
    [].concat(...ledmatrix).forEach(color => {
      serializedData.push(...color.get_color());
    });
    socket.write(Uint8Array.from(serializedData));
  }
  frame_to_console();
}

function frame_to_console() {
  var frame_console = "";
  for(var i = 0; i < ledmatrix.length; i++) {
    for(var j = 0; j < ledmatrix[i].length; j++) {
      frame_console+=`(${ledmatrix[i][j].get_red()},${ledmatrix[i][j].get_green()},${ledmatrix[i][j].get_blue()})` 
    }
    frame_console+="\n";
  }
  logging(frame_console, true);
  return frame_console;
}

function set_color_full(red, green, blue) {
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

function play_effect() {
  play();
  switch (playing_effect) {
    case "random_each":
      manager.set_effect("random_each", ledmatrix);
      break;
    case "random_full":
      manager.set_effect("random_full", ledmatrix);
      break;
    default:
      pause();
      playing_effect = null;
      set_color_full(100,0,0);
      frame_to_ledcontroller();
      sendStatus();
  }
}

setInterval(() => {
  if(!ispaused) {
    if(playing_effect != null) {
      ledmatrix = manager.run();
      frame_to_ledcontroller();
    }
  }
  else {
    logging("PAUSED", true);
  }
}, 200);

function logging(message, msgdebug = false){
  if (!msgdebug) {
    console.log(message);
    client.publish('logs/controller', message);
  }
  else if(msgdebug && debug) {
    console.log(message);
  }
}