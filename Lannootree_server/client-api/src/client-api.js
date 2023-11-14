import dotenv from 'dotenv';
import { WebSocketServer } from 'ws';
import mqtt from "mqtt";
import * as fs from 'fs';

dotenv.config({ path: '../../.env' })

// MQTT ______________________________________________________________________________________

if (process.env.MQTT_BROKER_EXTERNAL === 'false') {
  var caFile = fs.readFileSync("ca.crt");
  var clientcrt = fs.readFileSync("client.crt");
  var clientkey = fs.readFileSync("client.key");
}
var options={
  clientId:"client-api_" + Math.random().toString(16).substring(2, 8),
  protocol: process.env.MQTT_BROKER_PROTOCOL,
    will: {
        topic: process.env.TOPIC_PREFIX + "/status/client-api",
        payload: "Offline",
        retain: true
    }
};
if (process.env.MQTT_BROKER_EXTERNAL === 'true') {
  if (process.env.NO_CREDENTIALS === 'false') {
    options.password = process.env.MQTT_BROKER_PASSWORD;
    options.user = process.env.MQTT_BROKER_USER;
  }
  options.port = process.env.MQTT_BROKER_PORT;
  options.host = process.env.MQTT_BROKER_URL;
} 
else {
  options.port = process.env.MQTT_BROKER_LOCAL_PORT;
  options.host = process.env.MQTT_BROKER_LOCAL_URL;
  options.rejectUnauthorized = false;
  options.ca = caFile;
  options.cert = clientcrt;
  options.key = clientkey;
}
const client = mqtt.connect(options);

client.on('connect', function () {
  if (process.env.MQTT_BROKER_EXTERNAL === 'true') {
    logging("[INFO] mqtt connected to external broker") }
    else { 
      logging("[INFO] mqtt connected to local broker")
    }
    client.publish(process.env.TOPIC_PREFIX + '/status/client-api', 'Online', {retain: true});

    client.subscribe(process.env.TOPIC_PREFIX + '/controller/#');
    client.subscribe(process.env.TOPIC_PREFIX + '/lannootree/out');
});

client.on('close', function () {
  logging("[INFO] mqtt connection closed");
});

client.on('offline', function () {
  logging("[INFO] mqtt connection offline");
});

client.on('end', function () {
  logging("[INFO] mqtt connection ended");
});


// msg buffer___________________________________________________________________________________________
var statusJSON;
var contentJSON;

// websocket _________________________________________________________________________________
const websocket = new WebSocketServer({ port: 3001 });

websocket.on('connection', (ws, req) => {
  let sender = req.headers['remote-name']
  logging(`[INFO] Websocket connection from: ${req.headers['x-forwarded-for']} as: ${sender}`);

  ws.send(JSON.stringify({"Connection" : "Hello from server: Client-API"}));
  ws.send(JSON.stringify(statusJSON));

  ws.on("message", data => {
    
    try {
      data = JSON.parse(data.toString())
      if(data.hasOwnProperty('stop')) {stop(sender);}
      if(data.hasOwnProperty('pause')) {pause(sender)}
      if(data.hasOwnProperty('play')) {play(sender)}
      if(data.hasOwnProperty('media')) {media(data.media,sender)}
      if(data.hasOwnProperty('Color')) {
        if (parseColor(data.Color) != null) setcolor(parseColor(data.Color,sender));
      }
    } 
    catch (error) { 
      logging("[ERROR] Websocket received data exception"); 
    }
      
  });



    
  ws.on ("close", () => {
      logging("[INFO] Websocket client disconnected");
  });
  // other MQTT___________________________________________________________________________________________

  client.on('message', function (topic, message) {
    switch (topic) {
      case process.env.TOPIC_PREFIX + '/controller/status':
        try {
          statusJSON = JSON.parse(message);
          ws.send(JSON.stringify(statusJSON));
          ws.send(JSON.stringify(statusJSON));
        } 
        catch (error) {
          logging("[ERROR] MQTT statusJSON invalid"); 
        }
          break;
        
        case process.env.TOPIC_PREFIX + '/lannootree/out':
          ws.send(JSON.stringify({matrix: JSON.parse(message.toString())}));
          break;
                
        default:
          break;
    }
  })
});

// Sending updates_________________________________________
function stop(sender) {
  logging(`[INFO] {${sender}} is sending stop`);
  client.publish(process.env.TOPIC_PREFIX + '/controller/in', JSON.stringify({"command": "stop"}));
}

function pause(sender) {
  logging(`[INFO] {${sender}} is sending pause`);
  client.publish(process.env.TOPIC_PREFIX + '/controller/in', JSON.stringify({"command": "pause"}));
}

function play(sender) {
  logging(`[INFO] {${sender}} is sending play`);
  client.publish(process.env.TOPIC_PREFIX + '/controller/in', JSON.stringify({"command": "play"}));
}

function togglepause(sender) {
  logging(`[INFO] {${sender}} is sending togglepause`);
  client.publish(process.env.TOPIC_PREFIX + '/controller/pause', JSON.stringify({"value": "togglepause"}));
}

function media(media_id, sender) {
  logging(`[INFO] {${sender}} is sending set-media: ${media_id}`);
  client.publish(process.env.TOPIC_PREFIX + '/controller/in', JSON.stringify({"command": "play_media", "media_id": media_id}));
}

function setcolor(color, sender) {
  logging(`[INFO] {${sender}} is sending color: ${color}`);
  client.publish(process.env.TOPIC_PREFIX + '/controller/in', JSON.stringify({"command": "color", "red": parseInt(color[0]), "green": parseInt(color[1]), "blue": parseInt(color[2])}));
}

function parseColor(input, sender) {
  if (!input.match(/#[0-9,A-Z,a-z]{6}/g))logging("[ERROR] Color is not in hex format (#FFFFFF)");

  let hex = input.match(/[^#].{1}/g);
  try {
    let output = [
      parseInt(hex[0], 16),
      parseInt(hex[1], 16),
      parseInt(hex[2], 16)
    ];
    return output;
  } catch (error) {
    logging("[ERROR] Color parsing from string");
  }
  return null;
}


function logging(message, msgdebug = false){
  if (!msgdebug) {
    console.log(message);
    client.publish(process.env.TOPIC_PREFIX + '/logs/client-api', message);
  }
  else if(msgdebug && debug) {
    console.log(message);
  }
}