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

client.on('message', async function (topic, message) {
  let data = message;
  try {
    data = JSON.parse(message.toString());
  } catch (error) {
    data = message;
  }
  switch (topic) {
    case "storage/in":
      switch(data.command) {
        case "add_file": add_file(data.json, data.name, data.category, data.description); break;
        case "send_media": send_media(); break;
        case "play": play_stream(data.id, data.streamtopic); break;
        case "stop_current": stop_current_stream(); break;
        case "pause_current": pause_current_stream(); break;
        case "play_current": play_current_stream(); break;
      }
  }
});

const dbmanager = new DBManager("localhost","storage","storage","storage");

async function add_file(json, name, category, description) {
  let media_id = await dbmanager.addFile(name, category, description, CONFIGHASH);
  if (media_id != null) {
    fs.writeFile(`./db/${media_id}.json`, json, (err) => {
      if (!err) {
        logging(`[INFO] ADDED ${name} TO DB AND FILESYSTEM`)
      } else {
        logging(`[ERROR] FAILED TO ADD ${name} TO FILESYSTEM`)
      }
    });
  }
  else {
    logging(`[ERROR] FAILED TO ADD ${name} TO DB`)
  }
}

async function send_media() {
  let media = await dbmanager.getAllMedia();
  client.publish('controller/in', JSON.stringify({"command": "media", "media": media})); // SHOULD BE CHANGED
}

async function play_stream(id, streamTopic) {
  const row = await dbmanager.getMediaRow(id);
  if(row != null) {
    if(row.deleted == null) {
      if(row.config_hash == CONFIGHASH) {
        const filepath = `./db/${row.id}.json`
        if (fs.existsSync(filepath)) {
          if(player != null) {
            stop_current_stream();
            player.play(filepath, streamTopic, id);
          }
        } else {
          logging(`[ERROR] CANNOT PLAY STREAM FOR MEDIA_ID ${id}: THE FILE db/${id}.json DOESN'T EXIST ANYMORE`)
          return;
        }
      }
      else {
        logging(`[ERROR] CANNOT PLAY STREAM FOR MEDIA_ID ${id}: WRONG CONFIG HASH (${row.config_hash}), SHOULD BE ${CONFIGHASH}`)
        return;
      }
    } else {
      logging(`[ERROR] CANNOT PLAY STREAM FOR MEDIA_ID ${id}: ITS DELETED`)
      return;
    }
  }
  else {
    logging(`[ERROR] CANNOT PLAY STREAM FOR MEDIA_ID ${id}: THE MEDIA_ID DOES NOT EXIST!`)
    return;
  }
}

function stop_current_stream() {
  if(player != null) player.stop();
}

function pause_current_stream() {
  if(player != null) player.pause();
}

function play_current_stream() {
  if(player != null) player.unpause();
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