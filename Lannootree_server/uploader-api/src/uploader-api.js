const mqtt = require('mqtt');
const dotenv = require('dotenv');
const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');
const { json } = require('express');

dotenv.config({ path: '../.env' });

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
  port: process.env.MQTT_BROKER_PORT,
  host: process.env.MQTT_BROKER_URL,
  protocol:'mqtts',
  rejectUnauthorized : true,
  ca:caFile,
  cert: clientcrt,
  key: clientkey, 
    will: {
        topic: "status/uploader-api",
        payload: "Offline",
        retain: true
    }
};


var mqtt_connected = false;

const client = mqtt.connect(options);
const app = express();
var mqtt_connected = false;
app.use(bodyParser.json());

client.on('connect', () => {
    logging("[INFO] mqtt connected")
    client.publish('status/uploader-api', 'Online', {retain: true});

    client.subscribe('voronoi/in');

    mqtt_connected = true;
});

app.use(express.static('public'));

app.post("/upload/post", function(req, res) {
  if(mqtt_connected){
    test1 = JSON.stringify(req.files)
    client.publish('/$SYS/broker/uploads', test1, options);
    console.log(req.files);

    res.send('Image is send.')
    // logging("[INFO] image is uploaded to mqtt.")
  }
});

function logging(message, msgdebug = false){
    if (!msgdebug) {
      console.log(message);
      client.publish('logs/uploader-api', message);
    }
    else if(msgdebug && debug) {
      console.log(message);
    }
}


app.listen(process.env.PORT_EXPRESS, () =>
  logging(`[INFO] app listening on port ${process.env.PORT_EXPRESS}`),
);  