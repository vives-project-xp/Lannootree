// npm install ws mqtt nodemon

// mqtt ______________________________________________________________________________________
import mqtt from "mqtt"

const client = mqtt.connect('mqtt://lannootree.devbitapp.be:1883');

client.on('connect', function () {
    console.log("mqtt connected")
    client.publish('status/client-api', 'Online');
})

client.on("connect", () => {
    // ws.send("stop");
});


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
const websocket = new WebSocketServer({ port: 3001 });

wss.on('connection', (ws, req) => {
    console.log('Websocket connection from: ' . req.headers['x-forwarded-for']);

    ws.on("message", data => {
        console.log('Reicieved: ' . data.Tostring());
        if(data == "stop") {
            onOff();
        }
    });


    ws.on("close", () => {
        console.log("client has disconnected")
    });
    
});

// mqtt publish /AbortController