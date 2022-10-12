import Color from './color.js';
import EffectManager from "./effect_manager.js";
import RandomEach from './effects/random_each.js';
import RandomFull from './effects/random_full.js';

import mqtt from "mqtt"
import net from "net"
import { serialize } from 'v8';

// MQTT
const client = mqtt.connect('mqtt://lannootree.devbitapp.be:1883');

// Socket client
const socket = net.createConnection("/var/run/lannootree.socket");

client.on('connect', function () {
  console.log("connected");
  client.publish('status/controller', 'Online');
  
  client.subscribe('controller/matrixsize');
  client.subscribe('controller/stop');
  client.subscribe('controller/pause');
  client.subscribe('controller/setcolor');
  client.subscribe('controller/effect');
  client.subscribe('controller/asset');
  
  client.publish('controller/matrixsize', JSON.stringify({"rows": 5,"columns": 5}));  // DEBUGGING
})

client.on('message', function (topic, message) {
  if(topic=="controller/matrixsize") {
    set_matrixsize(JSON.parse(message.toString()).rows, JSON.parse(message.toString()).columns);
  }

  else if(topic=="controller/pause") {
    const json_obj = JSON.parse(message.toString());
    if(json_obj.value == "pause") pause();
    else if(json_obj.value == "togglepause") togglepause();
    else if(json_obj.value == "play") play();
  }

  else if(topic=="controller/stop") stop();
  
  else if(topic=="controller/setcolor") {
    playing_effect = null;
    const json_obj = JSON.parse(message.toString());
    set_color_full(json_obj.red, json_obj.green, json_obj.blue);
    frame_to_ledcontroller();
  }

  else if(topic=="controller/effect") {
    const json_obj = JSON.parse(message.toString());
    playing_effect = json_obj.effect_id;
    play_effect();
  }

  else if(topic=="controller/asset") console.log("ASSET");

  else console.log("Unknown topic");
})

// CONTROLLER

const manager = new EffectManager();
const random_each = new RandomEach(ledmatrix);
const random_full = new RandomFull(ledmatrix);

var ledmatrix = [];

function set_matrixsize(rows, columns) {
  pause();
  if(!isNaN(rows) && !isNaN(columns)) {
    ledmatrix = Array.from(Array(Math.abs(rows)), () => new Array(Math.abs(columns)));
    
    const offcolor = new Color(0,0,0);
    for(var i = 0; i < ledmatrix.length; i++) {
      for(var j = 0; j < ledmatrix[i].length; j++) {
        ledmatrix[i][j] = new Color(0,0,0);
      }
    }

    console.log(`NEW MATRIX SIZE: \tROWS: ${Math.abs(rows)}, COLUMNS: ${Math.abs(columns)}`);
  }
  
  if(playing_effect != null) play();
}

var ispaused = true;
function pause() {
  ispaused = true;
}
function play() {
  ispaused = false;
}
function togglepause() {
  ispaused = !ispaused;
}

function frame_to_ledcontroller() {
  // ------------------------------------
  // CODE FRAME STUREN NAAR LEDCONTROLLER


  // ------------------------------------
  frame_to_console(ledmatrix); // DEBUGGING
}

function frame_to_console() { // DEBUGGING
  var frame_console = "";
  for(var i = 0; i < ledmatrix.length; i++) {
    for(var j = 0; j < ledmatrix[i].length; j++) {
      frame_console+=`(${ledmatrix[i][j].get_red()},${ledmatrix[i][j].get_green()},${ledmatrix[i][j].get_blue()})` 
    }
    frame_console+="\n";
  }
  console.log(frame_console);
  return frame_console;/**
  * Write data to socket
  */
 function frame_to_controller() {
   let serializedData = [];
 
   [].concat(...ledmatrix).forEach(color => {
     serializedData.concat(color.get_color());
   });
 
   socket.write(Uint8Array.from(serializedData));
 }
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

/**
 * Write data to socket
 */
function frame_to_controller() {
  let serializedData = [];

  [].concat(...ledmatrix).forEach(color => {
    serializedData.concat(color.get_color());
  });

  socket.write(Uint8Array.from(serializedData));
}

var playing_effect = null;

function play_effect() {
  play();
  if(playing_effect == "effect1") {     //RANDOM KLEUREN (VOLLEDIG PANEEL)
    random_each.set_ledmatrix(ledmatrix);
    manager.set_effect(random_each);
  }
  else if(playing_effect == "effect2") {  //RANDOM KLEUREN (IEDERE LED APART)
    random_full.set_ledmatrix(ledmatrix);
    manager.set_effect(random_full);
  }
  else {
    pause();
    playing_effect = null;
    set_color_full(100,0,0);
    frame_to_ledcontroller();
  }
}

function stop(){
  pause();
  playing_effect = null;
  set_color_full(0,0,0);
  frame_to_ledcontroller();
}

setInterval(() => {
  if(!ispaused) {
    if(playing_effect != null) {
      manager.run();
      frame_to_ledcontroller();
    }
  }
  else {
    console.log("PAUSED");
  }
}, 200);