import dotenv from 'dotenv';
import { WebSocketServer } from 'ws';
import mqtt from "mqtt";
import * as fs from 'fs';

dotenv.config({ path: '../.env' })

// MQTT ______________________________________________________________________________________

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
};
const client = mqtt.connect(options);

client.on('connect', function () {
    logging("[INFO] mqtt connected")
    client.publish('status/client-api', 'Online', {retain: true});

    client.subscribe('controller/#');
    client.subscribe('lannootree/out');
});

// msg buffer___________________________________________________________________________________________
var statusJSON;
var contentJSON;

// websocket _________________________________________________________________________________
const websocket = new WebSocketServer({ port: 3001 });

websocket.on('connection', (ws, req) => {
    logging('[INFO] Websocket connection from: ' + req.headers['x-forwarded-for']);
    ws.send(JSON.stringify({"Connection" : "Hello from server: Client-API"}));
    ws.send(JSON.stringify(statusJSON));

    ws.on("message", data => {
        
        try {
            data = JSON.parse(data.toString())
            if(data.hasOwnProperty('stop')) {stop();}
            if(data.hasOwnProperty('pause')) {pause()}
            if(data.hasOwnProperty('play')) {play()}
            if(data.hasOwnProperty('effect')) {effect(data.effect)}
            if(data.hasOwnProperty('asset')) {asset(data.asset)}
            if(data.hasOwnProperty('Color')) {
                if (parseColor(data.Color) != null) setcolor(parseColor(data.Color));
            }
        } 
        catch (error) { 
            logging("[ERROR] Websocket received data exception"); 
        }
        
    });



    
    ws.on("close", () => {
        logging("[INFO] Websocket client disconnected");
    });
    // other MQTT___________________________________________________________________________________________

    client.on('message', function (topic, message) {
        switch (topic) {
            case "controller/status":
                try {
                    statusJSON = JSON.parse(message);
                    ws.send(JSON.stringify(statusJSON));
                } 
                catch (error) { 
                    logging("[ERROR] MQTT statusJSON invalid"); 
                }
                break;
            case "lannootree/out":
                ws.send(JSON.stringify({matrix: JSON.parse(message.toString())}));
                break;
                
            default:
                break;
        }
})
});

// Sending updates_________________________________________
function stop() {
    logging('[INFO] sending stop');
    client.publish('controller/stop', JSON.stringify({"value": "stop"}));
}

function pause() {
    logging('[INFO] sending pause');
    client.publish('controller/pause', JSON.stringify({"value": "pause"}));
}

function play() {
    logging('[INFO] sending play');
    client.publish('controller/pause', JSON.stringify({"value": "play"}));
}

function togglepause() {
    logging('[INFO] sending togglepause');
    client.publish('controller/pause', JSON.stringify({"value": "togglepause"}));
}

function effect(effect_id) {
    logging(`[INFO] sending set-effect: ${effect_id}`);
    client.publish('controller/effect', JSON.stringify({"effect_id": effect_id}));
}

function asset(asset_id) {
    logging(`[INFO] sending set-asset: ${asset_is}`);
    client.publish('controller/asset', JSON.stringify({"asset_id": asset_id}));
}

function setcolor(color) {
    client.publish('controller/setcolor', JSON.stringify({"red": parseInt(color[0]), "green": parseInt(color[1]), "blue": parseInt(color[2])}));
}


function parseColor(input) {
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
        client.publish('logs/client-api', message);
    }
    else if(msgdebug && debug) {
        console.log(message);
    }
}