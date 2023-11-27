const mqtt = require('mqtt');
const dotenv = require('dotenv');
const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');
const { json } = require('express');

dotenv.config({ path: '../../.env' });

if (process.env.MQTT_BROKER_EXTERNAL === 'false') {
  var caFile = fs.readFileSync("ca.crt");
  var clientcrt = fs.readFileSync("client.crt");
  var clientkey = fs.readFileSync("client.key");
}

const handleError = (err, res) => {
  res
    .status(500)
    .contentType("text/plain")
    .end("Oops! Something went wrong!");
};
var options={
  clientId:"uploader-api_" + Math.random().toString(16).substring(2, 8),
  protocol: process.env.MQTT_BROKER_PROTOCOL,
    will: {
        topic: process.env.TOPIC_PREFIX + "/status/uploader-api",
        payload: "Offline",
        retain: true
    }
};

if (process.env.MQTT_BROKER_EXTERNAL === 'true') {
  if (process.env.NO_CREDENTIALS === 'false') {
   options.password = process.env.MQTT_BROKER_PASSWORD;
   options.user = process.env.MQTT_BROKER_USER;
  }
 options.port = process.env.MQTT_BROKER_PORT;
 options.host = process.env.MQTT_BROKER_URL;
} 
else {
 options.port = process.env.MQTT_BROKER_LOCAL_PORT;
 options.host = process.env.MQTT_BROKER_LOCAL_URL;
 options.rejectUnauthorized = false;
 options.ca = caFile;
 options.cert = clientcrt;
 options.key = clientkey;
}

var mqtt_connected = false;

const client = mqtt.connect(options);
const app = express();
app.use(bodyParser.json());

client.on('connect', () => {
  if (process.env.MQTT_BROKER_EXTERNAL === 'true') {
    logging("[INFO] mqtt connected to external broker") }
    else { 
      logging("[INFO] mqtt connected to local broker")
    }
    client.publish(process.env.TOPIC_PREFIX + '/status/uploader-api', 'Online', {retain: true});

    client.subscribe(process.env.TOPIC_PREFIX + '/voronoi/in');

    mqtt_connected = true;
});

app.use(express.static('public'));

app.post("/upload/post", function(req, res) {
  console.log("Received POST request:", req.body);
  if(mqtt_connected){
    test1 = JSON.stringify(req.files)
    client.publish(process.env.TOPIC_PREFIX + '/uploads', test1, options);
    console.log(req.files);

    res.send('Image is sent.')
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