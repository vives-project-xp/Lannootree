import dotenv from 'dotenv';
import mqtt from "mqtt";
import * as fs from 'fs';

dotenv.config({ path: '../.env' })

import Player from "./player.js";
import DBManager from "./dbmanager.js";

const CONFIGHASH = "config1";

// MQTT ______________________________________________________________________________________
var instanceName = "storage";
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
    topic: "status/" + instanceName,
    payload: "Offline",
    retain: true
  }
};
const client = mqtt.connect(options);

var player = null;
client.on('connect', function () {
  logging("[INFO] mqtt connected")
  client.publish("status/" + instanceName, 'Online', {retain: true});
  client.subscribe("storage/in");
  player = new Player(client);
});

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
        case "play": play_stream(data.id, data.streamtopic); break;  //stream_001
        case "stop": stop_stream(); break;
      }
  }
});

const dbmanager = new DBManager("localhost","storage","storage","storage");

async function send_media() {
  let media = await dbmanager.getAllMedia();
  client.publish('controller/in_test', JSON.stringify({"command": "media", "media": media})); // SHOULD BE CHANGED
}

async function play_stream(id, streamTopic) {
  const row = await dbmanager.getMediaRow(id);
  if(row != null) {
    if(row.config_hash == CONFIGHASH) {
      const filepath = `./db/${row.config_hash}/${row.filename_hash}`
      if (fs.existsSync(filepath)) {
        if(player != null) {
          stop_stream();
          player.play(filepath, streamTopic);
        }
      } else {
        logging(`[ERROR] CANNOT PLAY STREAM FOR MEDIA_ID ${id}: THE FILE ${row.filename_hash} DOESN'T EXIST ANYMORE IN db/${row.config_hash}`)
        return;
      }
    }
    else {
      logging(`[ERROR] CANNOT PLAY STREAM FOR MEDIA_ID ${id}: CONFIG_HASH FOR MEDIA_ID IS ${row.config_hash} AND SHOULD BE ${CONFIGHASH}`)
      return;
    }
  }
  else {
    logging(`[ERROR] CANNOT PLAY STREAM FOR MEDIA_ID ${id}: THE MEDIA_ID MIGHT DOESN'T EXIST ANYMORE IN THE DB, OR THE DELETED COLUMN IS NOT NULL ANYMORE`)
    return;
  }
}

function stop_stream() {
  if(player != null) player.stop();
}

function logging(message, msgdebug = false) {
  if (!msgdebug) {
    console.log(message);
    client.publish('logs/' + instanceName, message);
  }
  else if(msgdebug && debug) {
    console.log(message);
  }
}