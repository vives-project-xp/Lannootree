const mqtt = require('mqtt');
const dotenv = require('dotenv');
const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');
const { json } = require('express');

dotenv.config({ path: '../../.env' });

var caFile = fs.readFileSync("ca.crt");
var clientcrt = fs.readFileSync("client.crt");
var clientkey = fs.readFileSync("client.key");

const handleError = (err, res) => {
  res
    .status(500)
    .contentType("text/plain")
    .end("Oops! Something went wrong!");
};

var caFile = fs.readFileSync("ca.crt");
var options={
  clientId:"clientapi" + Math.random().toString(16).substring(2, 8),
  protocol: process.env.MQTT_BROKER_PROTOCOL,
    will: {
        topic: process.env.TOPIC_PREFIX + "/status/uploader-api",
        payload: "Offline",
        retain: true
    }
};

if (process.env.MQTT_BROKER_EXTERNAL === 'true') {
  if (process.env.NO_CREDENTIALS === 'false') {
   mqttOptions.password = process.env.MQTT_BROKER_PASSWORD;
   mqttOptions.user = process.env.MQTT_BROKER_USER;
  }
 mqttOptions.port = process.env.MQTT_BROKER_PORT;
 mqttOptions.host = process.env.MQTT_BROKER_URL;
} 
else {
 mqttOptions.port = process.env.MQTT_BROKER_LOCAL_PORT;
 mqttOptions.host = process.env.MQTT_BROKER_LOCAL_URL;
 mqttOptions.rejectUnauthorized = false;
 mqttOptions.ca = caFile;
 mqttOptions.cert = clientcrt;
 mqttOptions.key = clientkey;
}

var mqtt_connected = false;

const client = mqtt.connect(options);
const app = express();
var mqtt_connected = false;
app.use(bodyParser.json());

client.on('connect', () => {
    logging("[INFO] mqtt connected")
    client.publish(process.env.TOPIC_PREFIX + '/status/uploader-api', 'Online', {retain: true});

    client.subscribe(process.env.TOPIC_PREFIX + '/voronoi/in');

    mqtt_connected = true;
});

app.use(express.static('public'));

app.post("/upload/post", function(req, res) {
  if(mqtt_connected){
    test1 = JSON.stringify(req.files)
    client.publish(process.env.TOPIC_PREFIX + '/uploads', test1, options);
    console.log(req.files);

    res.send('Image is send.')
    // logging("[INFO] image is uploaded to mqtt.")
  }
});

function logging(message, msgdebug = false){
    if (!msgdebug) {
      console.log(message);
      client.publish(process.env.TOPIC_PREFIX + '/logs/uploader-api', message);
    }
    else if(msgdebug && debug) {
      console.log(message);
    }
}


app.listen(3000, () =>
  logging(`[INFO] listening internal on port 3000`),
);