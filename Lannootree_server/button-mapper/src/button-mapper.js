import mqtt from "mqtt";
import fs from "fs";
import dotenv from "dotenv";
dotenv.config({ path: '../../.env' });

var instanceName = "button-mapper";

// MQTTS______________________________________________________________
var caFile = fs.readFileSync("./ca.crt");
var clientcrt = fs.readFileSync("./client.crt");
var clientkey = fs.readFileSync("./client.key");
var options = {
  clientId:"button-mapper_" + Math.random().toString(16).substring(2, 8),
  port: process.env.MQTT_BROKER_local_PORT,
  host: process.env.MQTT_BROKER_local_URL,
  protocol:'mqtt',
  rejectUnauthorized : true,
  ca:caFile,
  cert: clientcrt,
  key: clientkey,
  will: {
      topic: "status/button-mapper",
      payload: "Offline",
      retain: true
  }
};
const client_mqtts = mqtt.connect(options);
client_mqtts.on('connect', function () {
  logging("INFO: mqtts connected");
  client_mqtts.publish("status/" + instanceName, 'Online', {retain: true});
  logging("INFO: button-mapper started")
});
client_mqtts.on('error', function(error) {
  logging("ERROR: mqtts: " + error);
});
var options = {
  clientId:"button-mapper_" + Math.random().toString(16).substring(2, 8),
  port: 1883,
  host: process.env.MQTT_BROKER_URL,
  protocol:'mqtt'
};
// MQTT______________________________________________________________
const client_mqtt = mqtt.connect(options);
client_mqtt.on('connect', function () {
  client_mqtt.subscribe("esp_remote");
  client_mqtt.subscribe("esp_remote_mini");
  logging("INFO: mqtt connected");
});
client_mqtt.on('error', function(error) {
  logging("ERROR: mqtt: " + error);
});

// MESSAGE______________________________________________________________

client_mqtt.on('message', function (topic, message) {
  let data = message;
  try {
    data = JSON.parse(message.toString());
  } catch (error) {
    data = message;
  }
  switch (topic) {
    case "esp_remote":
      switch(data.button) {
        case "1": client_mqtts.publish('controller/in', JSON.stringify({"command": "play_effect", "effect_name": 1})); break;
        case "2": client_mqtts.publish('controller/in', JSON.stringify({"command": "play_effect", "effect_name": 2})); break;
        case "3": client_mqtts.publish('controller/in', JSON.stringify({"command": "play_effect", "effect_name": 3})); break;
        case "4": client_mqtts.publish('controller/in', JSON.stringify({"command": "play_effect", "effect_name": 4})); break;
        case "5": client_mqtts.publish('controller/in', JSON.stringify({"command": "play_effect", "effect_name": 5})); break;
        case "6": client_mqtts.publish('controller/in', JSON.stringify({"command": "play_effect", "effect_name": 6})); break;
        case "7": client_mqtts.publish('controller/in', JSON.stringify({"command": "play_effect", "effect_name": 7})); break;
        case "8": client_mqtts.publish('controller/in', JSON.stringify({"command": "play_effect", "effect_name": 8})); break;
        case "9": client_mqtts.publish('controller/in', JSON.stringify({"command": "play_effect", "effect_name": 9})); break;
        case "10": client_mqtts.publish('controller/in', JSON.stringify({"command": "play_effect", "effect_name": 10})); break;
        case "11": client_mqtts.publish('controller/in', JSON.stringify({"command": "play_effect", "effect_name": 11})); break;
        case "12": client_mqtts.publish('controller/in', JSON.stringify({"command": "play_effect", "effect_name": 12})); break;
        case "13": client_mqtts.publish('controller/in', JSON.stringify({"command": "play_effect", "effect_name": 0})); break;
        case "14": client_mqtts.publish('controller/in', JSON.stringify({"command": "stop"})); break;
        case "15": client_mqtts.publish('controller/in', JSON.stringify({"command": "pause"})); break;
        case "16": client_mqtts.publish('controller/in', JSON.stringify({"command": "play"})); break;
      }
    break;
    case "esp_remote_mini":
      switch(data.button) {
        case "1": client_mqtts.publish('controller/in', JSON.stringify({"command": "previous"})); break;
        case "2": client_mqtts.publish('controller/in', JSON.stringify({"command": "next"})); break;
      }
    break;
  }
});

// general__________________________________________________________________
function logging(message, msgdebug = false) {
  if (!msgdebug) {
    console.log(message);
    client_mqtts.publish('logs/' + instanceName, message);
  }
  else if(msgdebug && debug) {
    console.log(message);
  }
}

function crashApp(message) {
  console.log('FATAL: ' + message);
  client_mqtts.publish('logs/' + instanceName, 'FATAL: ' + message, (error) => {
    process.exit(1);
  })
}