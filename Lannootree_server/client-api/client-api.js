// websocket _________________________________________________________________________________
import { WebSocketServer } from 'ws';
const websocket = new WebSocketServer({ port: 3001 });

websocket.on('connection', (ws, req) => {
    console.log('Websocket connection from: ' + req.headers['x-forwarded-for']);
    ws.send(JSON.stringify({"Connection" : "Hello from server: Client-API"}));

    ws.on("message", data => {
        console.log("new msg from ws");
        try {
            console.log(JSON.parse(data));
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
            console.log("ERROR: Websocket data invalid"); 
        }
        
    });
    
    
    ws.on("close", () => {
        console.log("Websocket client disconnected")
    });
    
});

// MQTT ______________________________________________________________________________________
import mqtt from "mqtt"
import * as fs from 'fs';

var caFile = fs.readFileSync("ca.crt");
var options={
  clientId:"firmwarecontroller",
  port:8883,
  host:'lannootree.devbitapp.be',
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
    console.log("mqtt connected")
    client.publish('status/client-api', 'Online', {retain: true});

    client.subscribe('controller/#', function (err) {
        if (err) {
            console.log("ERROR: Can't subscribe to toppic controller/#");
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
                console.log("ERROR: MQTT statusJSON invalid"); 
            }
            break;
        case "controller/content":
            try {
                contentJSON = JSON.parse(message)
            } 
            catch (error) { 
                console.log("ERROR: MQTT contentJSON invalid"); 
            }
            break;
            
        default:
            break;
    }
    // message is Buffer
    // console.log(message.toString())
})
         
// Sending updates_________________________________________
function stop() {
    console.log('stop');
    client.publish('controller/stop', JSON.stringify({"value": "stop"}));
}

function pause() {
    console.log('pause');
    client.publish('controller/pause', JSON.stringify({"value": "pause"}));
}

function play() {
    console.log('play');
    client.publish('controller/pause', JSON.stringify({"value": "start"}));
}

function togglepause() {
    console.log('togglepause');
    client.publish('controller/pause', JSON.stringify({"value": "togglepause"}));
}

function effect(effect_id) {
    console.log(`effect: ${effect_id}`);
    client.publish('controller/effect', JSON.stringify({"effect_id": effect_id}));
}

function asset(asset_id) {
    console.log(`asset: ${asset_is}`);
    client.publish('controller/asset', JSON.stringify({"asset_id": asset_id}));
}

function setcolor(color) {
    console.log(`setcolor: (${color[0]},${color[1]},${color[2]})`);
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