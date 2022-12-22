import dotenv from 'dotenv';
import mqtt from "mqtt";
import * as fs from 'fs';

dotenv.config({ path: '../../.env' })

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
  port: process.env.MQTT_BROKER_local_PORT,
  host: process.env.MQTT_BROKER_local_URL,
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
  player = new Player(client); // the Player should only be created when the client is connected
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

const dbmanager = new DBManager("mysql","root","storage","storage");   // host, user, password, database

// This function uses the dbmanager to add the file to the DB. If everythings OK, the json file will also be written to the filesystem
async function add_file(json, name, category, description) {
  let media_id = await dbmanager.addFile(name, category, description, CONFIGHASH);  // The media_id gets returned if succesful (used in filename)
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

// This function sends the media over MQTT to the controller
async function send_media() {
  let media = await dbmanager.getAllMedia();
  client.publish('controller/in', JSON.stringify({"command": "media", "media": media}));
}

// This function performs checks if the media with a media_id can be played. If all checks pass, the call the player.play function to actually start the streaming process.
async function play_stream(id, streamTopic) {
  const row = await dbmanager.getMediaRow(id);  // Will return a row when its valid, otherwise null
  if(row != null) {                             // If the media_id is found:
    if(row.deleted == null) {                   // If the deleted column is NULL (NULL means no timestamp, means not deleted)
      if(row.config_hash == CONFIGHASH) {       // If the confighash is 'config1'
        const filepath = `./db/${row.id}.json`    
        if (fs.existsSync(filepath)) {          // If the file exists on the filesystem
          if(player != null) {                      // Only then:
            stop_current_stream();                  // Stop the current stream
            player.play(filepath, streamTopic, id); // Use the player to start a new stream
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