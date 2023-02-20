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
  port: process.env.MQTT_BROKER_PORT,
  host: process.env.MQTT_BROKER_URL,
  protocol:'mqtts',
  rejectUnauthorized : false,
  ca:caFile,
  cert: clientcrt,
  key: clientkey, 
    will: {
        topic: "status/uploader-api",
        payload: "Offline",
        retain: true
    }
};

const multer = require('multer');
var storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, './uploads/')
  },
  filename: function (req, file, callback) {
    callback(null, file.fieldname + '-' + Date.now())
  },
});

const uploadFiles = multer({ storage: storage }).array('multi-files', 10);

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

app.post('/upload/post', upload.('image'), function(req, res, next) {
  const image = req.file.buffer;
  console.log(image.toString());
  return res.send('OK');
});

app.post("/upload/", function(req, res) {
  if(mqtt_connected){
    console.log(req);
    test1 = JSON.stringify(req.files)
    client.publish('/$SYS/broker/uploads', test1, options);

    return res.send('Image is send.')
  }

  res.sendStatus(505);
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


app.listen(3000, () =>
  logging(`[INFO] listening internal on port 3000`),
);
