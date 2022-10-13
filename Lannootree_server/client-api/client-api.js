

// websocket _________________________________________________________________________________
import { WebSocketServer } from 'ws';
const websocket = new WebSocketServer({ port: 3001 });

websocket.on('connection', (ws, req) => {
    console.log('Websocket connection from: ' + req.headers['x-forwarded-for']);
    ws.send(JSON.stringify({"Connection" : "Hello from server: Client-API"}));

    ws.on("message", data => {
        console.log('Reicieved: ' . data.Tostring());
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

// mqtt ______________________________________________________________________________________
import mqtt from "mqtt"

// const client = mqtt.connect('mqtt://localhost:1883');
const client = mqtt.connect('mqtt://lannootree.devbitapp.be:1883');

client.on('connect', function () {
    console.log("mqtt connected")
    client.publish('status/client-api', 'Online', {retain: true});
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

// other MQTT___________________________________________________________________________________________
var statusJSON;

client.subscribe('controller/status/json', function (err) {
    console.log("ERROR: Can't subscribe to toppic controller/status/json");
})

client.on('message', function (topic, message) {
    switch (topic) {
        case "controller/status/json":
            try {
                statusJSON = JSON.parse(message)
            } 
            catch (error) { 
                console.log("ERROR: MQTT statusJSON invalid"); 
            }
            break;
    
        default:
            break;
    }
    // message is Buffer
    console.log(message.toString())
})


// will: a message that will sent by the broker automatically when the client disconnect badly. The format is:
// topic: the topic to publish
// payload: the message to publish
// qos: the QoS
// retain: the retain flag
// properties: properties of will by MQTT 5.0:
// willDelayInterval: representing the Will Delay Interval in seconds number,
// payloadFormatIndicator: Will Message is UTF-8 Encoded Character Data or not boolean,
// messageExpiryInterval: value is the lifetime of the Will Message in seconds and is sent as the Publication Expiry Interval when the Server publishes the Will Message number,
// contentType: describing the content of the Will Message string,
// responseTopic: String which is used as the Topic Name for a response message string,
// correlationData: The Correlation Data is used by the sender of the Request Message to identify which request the Response Message is for when it is received binary,
// userProperties: The User Property is allowed to appear multiple times to represent multiple name, value pairs object