import dotenv from 'dotenv';
import mqtt from "mqtt";
import * as fs from 'fs';
import * as sqlite3 from 'sqlite3';
const db = new sqlite3.default.Database('./db/storage.sqlite');
dotenv.config({ path: '../.env' })

import Player from "./player.js";

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

var player = null;
client.on('connect', function () {
  logging("[INFO] mqtt connected")
  client.publish('status/storage', 'Online', {retain: true});
  client.subscribe("storage/in");
  player = new Player(client);
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

client.on('message', function (topic, message) {
  let data = message;
  try {
    data = JSON.parse(message.toString());
  } catch (error) {
    data = message;
  }
  switch (topic) {
    case "storage/in":
      switch(data.command) {
        case "send_media": send_media(); break;
        case "play": play_stream(); break;
        case "stop": stop_stream(); break;
      }
  }
});

function send_media() {
  let new_media = [];
  db.serialize(() => {
    db.all(`SELECT * FROM media`, (err, result) => {
      if (err) {
        console.error(err.message);
      }
      console.log(result)
      for (let index = 0; index < result.length; index++) {
        new_media.push({id: result[index].id, name: result[index].name, category: result[index].category, description: result[index].description});
      }
      client.publish('controller/in', JSON.stringify({"command": "media", "media": new_media}));
    });
  });
}

function play_stream() {
  if(player != null) player.play("aap.gif.json");
}

function stop_stream() {
  if(player != null) player.stop();
}