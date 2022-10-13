// websocket _________________________________________________________________________________
import { WebSocketServer } from 'ws';
const websocket = new WebSocketServer({ port: 3001 });

websocket.on('connection', (ws, req) => {
    console.log('Websocket connection from: ' + req.headers['x-forwarded-for']);
    ws.send(JSON.stringify({"Connection" : "Hello from server: Client-API"}));

    ws.on("message", data => {
        console.log('Reicieved: ' . data);
        try {
            data = JSON.parse(data)
            if(data.hasOwnProperty('stop')) {stop();}
            if(data.hasOwnProperty('pause')) {pause()}
            if(data.hasOwnProperty('play')) {play()}
            if(data.hasOwnProperty('effect')) {effect(data.effect)}
            if(data.hasOwnProperty('asset')) {asset(data.asset)}
            if(data.hasOwnProperty('color')) {setcolor(data.color[0], data.color[1], data.color[2]);}
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

// var caFile = fs.readFileSync("ca.crt");
var options={
  clientId:"firmwarecontroller",
  port:1883,
//   port:8883,
  host:'lannootree.devbitapp.be',
  protocol:'mqtt',
//   protocol:'mqtts',
//   rejectUnauthorized : true,
//   ca:cert,
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
    console.log(message.toString())
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

function setcolor(red, green, blue) {
    console.log(`setcolor: (${red},${green},${blue})`);
    client.publish('controller/setcolor', JSON.stringify({"red": red, "green": green, "blue": blue}));
}