import Color from './color.js';
import EffectManager from "./effect_manager.js";

import mqtt from "mqtt";
import fs from "fs";

import net from "net"
import { serialize } from 'v8';

// Socket client
// const socket = net.createConnection("../led_driver/build/dev/lannootree.socket");

// MQTT

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
  console.log("mqtt connected");
  client.publish('status/controller', 'Online', {retain: true});
  client.subscribe('controller/#');
  sendContent();
})

client.on('message', function (topic, message) {

  if(topic=="controller/pause") {
    const json_obj = JSON.parse(message.toString());
    if(json_obj.value == "pause") pause();
    else if(json_obj.value == "togglepause") togglepause();
    else if(json_obj.value == "play") play();
  }

  else if(topic=="controller/stop") stop();
  
  else if(topic=="controller/setcolor") {
    playing_effect = null;
    const json_obj = JSON.parse(message.toString());
    color = [json_obj.red, json_obj.green, json_obj.blue];
    sendOnChange();
    color = null;
    set_color_full(json_obj.red, json_obj.green, json_obj.blue);
    frame_to_ledcontroller();
  }

  else if(topic=="controller/effect") {
    const json_obj = JSON.parse(message.toString());
    playing_effect = json_obj.effect_id;
    play_effect();
    sendOnChange();
  }

  else if(topic=="controller/asset") console.log("ASSET");

  else console.log("Unknown topic");
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

    console.log(`NEW MATRIX SIZE: \tROWS: ${Math.abs(rows)}, COLUMNS: ${Math.abs(columns)}`);
  }
  
  if(playing_effect != null) play();
}

function sendContent() {
  let obj = new Object();
  let matrix_obj = new Object();
  let matrixsize = get_matrixsize();
  matrix_obj.rows = matrixsize[0];
  matrix_obj.cols = matrixsize[1];
  obj.matrix = matrix_obj;
  let effect_obj = manager.get_effects();
  obj.effects = effect_obj;
  obj.assets = "NONE";
  // console.log(JSON.stringify(obj));

  client.publish('controller/content', JSON.stringify(obj));
}

function sendOnChange() {
  let obj = new Object();
  if(ispaused) obj.pause = "true";
  else obj.pause = "false";
  if(ispaused && playing_effect == null && playing_asset == null) obj.stop = "true";
  else obj.stop = "false";
  obj.effect = playing_effect;
  obj.asset = playing_asset;
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

// @jens de lijn in comment cracht de boel. dit omdat deze functie uitvoert voor dat fs klaar is met het uitlezen van config.json
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
  sendOnChange();
}
function play() {
  ispaused = false;
  sendOnChange();
}
function togglepause() {
  ispaused = !ispaused;
  sendOnChange();
}

function stop(){
  pause();
  playing_effect = null;
  playing_asset = null;
  set_color_full(0,0,0);
  frame_to_ledcontroller();
  sendOnChange();
}

function frame_to_ledcontroller() {
  // ------------------------------------
  // CODE FRAME STUREN NAAR LEDCONTROLLER
  let serializedData = [];

  [].concat(...ledmatrix).forEach(color => {
    serializedData.push(...color.get_color());
  });

  // socket.write(Uint8Array.from(serializedData));

  // ------------------------------------

  frame_to_console(); // DEBUGGING
}

function frame_to_console() { // DEBUGGING
  var frame_console = "";
  for(var i = 0; i < ledmatrix.length; i++) {
    for(var j = 0; j < ledmatrix[i].length; j++) {
      frame_console+=`(${ledmatrix[i][j].get_red()},${ledmatrix[i][j].get_green()},${ledmatrix[i][j].get_blue()})` 
    }
    frame_console+="\n";
  }
  // console.log(frame_console);
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
  if(playing_effect == "effect1") {     //RANDOM KLEUREN (VOLLEDIG PANEEL)
    manager.set_effect("random_each", ledmatrix);
  }
  else if(playing_effect == "effect2") {  //RANDOM KLEUREN (IEDERE LED APART)
    manager.set_effect("random_full", ledmatrix);
  }
  else {
    pause();
    playing_effect = null;
    set_color_full(100,0,0);
    frame_to_ledcontroller();
    sendOnChange();
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
    // console.log("PAUSED");
  }
}, 200);