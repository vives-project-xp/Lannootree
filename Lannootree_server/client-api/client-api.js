// npm install ws mqtt nodemon

// mqtt ______________________________________________________________________________________
import mqtt from "mqtt"

const client = mqtt.connect('mqtt://localhost:1883');
// const client = mqtt.connect('mqtt://lannootree.devbitapp.be:wss');

client.on('connect', function () {
    console.log("mqtt connected")
    client.publish('status/client-api', 'Online');
})

client.on("connect", () => {
    // ws.send("stop");
});

function pause() {
    console.log('pause');
    client.publish('controller/pause', JSON.stringify({"value": "pause"}));
}

function togglepause() {
    console.log('togglepause');
    client.publish('controller/pause', JSON.stringify({"value": "togglepause"}));
}

function start() {
    console.log('start');
    client.publish('controller/pause', JSON.stringify({"value": "start"}));
}

function stop() {
    console.log('stop');
    client.publish('controller/stop', JSON.stringify({"value": "stop"}));
}

function setcolor(red, green, blue) {
    console.log(`setcolor: (${red},${green},${blue})`);
    client.publish('controller/setcolor', JSON.stringify({"red": red, "green": green, "blue": blue}));
}

function effect(effect_id) {
    console.log(`effect: ${effect_id}`);
    client.publish('controller/effect', JSON.stringify({"effect_id": effect_id}));
}

// client.subscribe('controller/stop', function (err) {
// })
// client.on('message', function (topic, message) {
//     // message is Buffer
//     console.log(message.toString())
//     client.end()
// })

// websocket _________________________________________________________________________________
import { WebSocketServer } from 'ws';
const websocket = new WebSocketServer({ port: 3001 });

websocket.on('connection', (ws, req) => {
    console.log('Websocket connection from: ' + req.headers['x-forwarded-for']);

//     ws.on("message", data => {
//         console.log('Reicieved: ' . data.Tostring());
//         if(data == "stop") {
//             stop();
//         }
//     });


    ws.on("close", () => {
        console.log("Websocket client disconnected")
    });
    
});

// mqtt publish /AbortController