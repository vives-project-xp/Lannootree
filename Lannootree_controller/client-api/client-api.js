// npm install ws mqtt nodemon

// mqtt ______________________________________________________________________________________
import mqtt from "mqtt"
const client = mqtt.connect('mqtt://lannotree.devbitapp.be:1883');
// const client = mqtt.connect(process.env.MQTT_URL);

client.on('connect', function () {
    console.log("connected")
    client.publish('status/client-api', 'Online');
})

// publish on server
function onOff(onoff) {
<<<<<<< HEAD
    console.log('on');
    client.on('connect', function () {
        console.log("conencted")
        client.subscribe('controller/stop', function (err) {
            if (!err) {
                client.publish('controller/setcolor', JSON.stringify({red: 0, green: 0, blue: 0}));
            }
        })
    })
=======
    console.log('onOff');
    client.publish('controller/stop', onoff);
    console.log('peoe');
>>>>>>> c58715dc1f2a910b6ee22d437dee6955017ac3de
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