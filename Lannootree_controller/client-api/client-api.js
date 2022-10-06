// npm install ws mqtt nodemon

// mqtt ______________________________________________________________________________________
import mqtt from "mqtt"
const client = mqtt.connect('mqtt://vps.arnoschoutteten.be:1883');

// publish on server
function onOff(onoff) {
    console.log('on');
    client.on('connect', function () {
        console.log("conencted")
        client.subscribe('controller/stop', function (err) {
            if (!err) {
                client.publish('controller/stop', onoff);
                console.log('peoe');
            }
        })
    })
}
   

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