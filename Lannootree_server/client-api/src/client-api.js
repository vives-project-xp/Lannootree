// websocket _________________________________________________________________________________
import { WebSocketServer } from 'ws';
const websocket = new WebSocketServer({ port: 3001 });

websocket.on('connection', (ws, req) => {
    logging('INFO: Websocket connection from: ' + req.headers['x-forwarded-for']);
    ws.send(JSON.stringify({"Connection" : "Hello from server: Client-API"}));

    ws.on("message", data => {
        try {
            data = JSON.parse(data)
            if(data.hasOwnProperty('stop')) {stop();}
            if(data.hasOwnProperty('pause')) {pause()}
            if(data.hasOwnProperty('play')) {play()}
            if(data.hasOwnProperty('effect')) {effect(data.effect)}
            if(data.hasOwnProperty('asset')) {asset(data.asset)}
            if(data.hasOwnProperty('Color')) {
                setcolor(parseColor(data.Color));
            }
        } 
        catch (error) { 
            logging("ERROR: Websocket data invalid"); 
        }
        
    });
    
    
    ws.on("close", () => {
        logging("INFO: Websocket client disconnected")
    });
    
});

// MQTT ______________________________________________________________________________________
import mqtt from "mqtt"
import * as fs from 'fs';

var caFile = fs.readFileSync("ca.crt");
var options={
  clientId:"clientapi" + Math.random().toString(16).substring(2, 8),
  port: process.env.MQTT_BROKER_PORT,
  host: process.env.MQTT_BROKER_URL,
  protocol:'mqtts',
  rejectUnauthorized : true,
  ca:caFile,
    will: {
        topic: "status/client-api",
        payload: "Offline",
        retain: true
    }
}
const client = mqtt.connect(options);

client.on('connect', function () {
    logging("INFO: mqtt connected")
    client.publish('status/client-api', 'Online', {retain: true});

    client.subscribe('controller/#', function (err) {
        if (err) {
            logging("ERROR: Can't subscribe to toppic controller/#");
        }
    })
})

// other MQTT___________________________________________________________________________________________
var statusJSON;
var contentJSON;

client.on('message', function (topic, message) {
    switch (topic) {
        case "controller/status":
            try {
                statusJSON = JSON.parse(message)
            } 
            catch (error) { 
                logging("ERROR: MQTT statusJSON invalid"); 
            }
            break;
            
        default:
            break;
    }
})
         
// Sending updates_________________________________________
function stop() {
    logging('INFO: sending stop');
    client.publish('controller/stop', JSON.stringify({"value": "stop"}));
}

function pause() {
    logging('INFO: sending pause');
    client.publish('controller/pause', JSON.stringify({"value": "pause"}));
}

function play() {
    logging('INFO: sending play');
    client.publish('controller/pause', JSON.stringify({"value": "start"}));
}

function togglepause() {
    logging('INFO: sending togglepause');
    client.publish('controller/pause', JSON.stringify({"value": "togglepause"}));
}

function effect(effect_id) {
    logging(`INFO: sending set-effect: ${effect_id}`);
    client.publish('controller/effect', JSON.stringify({"effect_id": effect_id}));
}

function asset(asset_id) {
    logging(`INFO: sending set-asset: ${asset_is}`);
    client.publish('controller/asset', JSON.stringify({"asset_id": asset_id}));
}

function setcolor(color) {
    logging(`INFO: sending setcolor: (${color[0]},${color[1]},${color[2]})`, true);
    client.publish('controller/setcolor', JSON.stringify({"red": parseInt(color[0]), "green": parseInt(color[1]), "blue": parseInt(color[2])}));
}


function parseColor(input) {
    let output = input.substring(4)
    output = output.split(' ')

    output[0] = output[0].split('.')[0]
    output[1] = output[1].split('.')[0]
    output[2] = output[2].split('.')[0]
    output[2] = output[2].split(')')[0]

    return output;
}


function logging(message, msgdebug = false){
    if (!msgdebug) {
      console.log(message);
      client.publish('logs/client-api', message);
    }
    else if(msgdebug && debug) {
      console.log(message);
    }
  }