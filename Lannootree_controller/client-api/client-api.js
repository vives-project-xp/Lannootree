// npm install ws mqtt nodemon

// mqtt ______________________________________________________________________________________
import mqtt from "mqtt"
const client = mqtt.connect('mqtt://vps.arnoschoutteten.be:1883');
// const client = mqtt.connect(process.env.MQTT_URL);

client.on('connect', function () {
    console.log("connected")
    client.publish('status/client-api', 'Online');
})

// publish on server
function onOff(onoff) {
    console.log('onOff');
    client.publish('controller/stop', onoff);
    console.log('peoe');
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
const wss = new WebSocketServer({ port: 3001 });

wss.on('connection', ws => {
    console.log('connection to new client');
    
    ws.on("message", data => {
        console.log('Reicieved: ' . data);
        if(data == "stop") {
            onOff();
        }
    });


    ws.on("close", () => {
        console.log("client has disconnected")
    });
    
});

wss.on("connection", ws => {
    ws.send("stop");
});


// mqtt publish /AbortController