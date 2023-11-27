const mqtt = require('mqtt');
const dotenv = require('dotenv');
const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');
const { json } = require('express');
const multer = require('multer');
const path = require('path');
const { exec } = require('child_process');

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


// Define storage for uploaded files using multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/') // Set the destination folder where files will be stored
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname) // Set the file name in the destination folder
  }
});

const upload = multer({ storage: storage });

// Use the upload middleware to handle file uploads
app.post("/upload/post", upload.single('file'), function(req, res) {
  console.log("Received POST request:", req.body);
  console.log("Uploaded file:", req.file);

  if (mqtt_connected) {
    client.publish(process.env.TOPIC_PREFIX + '/uploads', JSON.stringify(req.file), options);

    const file = req.file.filename;
    
    const command = `python3 ./src/voronoizer.py -c config -i ./uploads/${file}`;
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error executing the command: ${error}`);
        return;
      }
      console.log(`Python command executed: ${stdout}`);
      
      if (stdout.includes("Done... saving data")) {
        const jsonFilePath = path.join(__dirname, `../uploads/processed_json/`, `${file}.json`);
        fs.readFile(jsonFilePath, 'utf8', (err, data) => {
          if (err) {
            console.error(`Error reading Json file: ${err}`);
            return;
          }
          const jsonContent = JSON.parse(data);
          const payload = {
            command: 'add_file',
            json: jsonContent,
            name: req.body.name,
            category: 'gif',
            description: req.body.description,
          };

          // Publish payload to MQTT topic
          logging(`[INFO] publishing payload ${req.body.name}, ${req.body.description} to ${process.env.TOPIC_PREFIX}/storage/in`);
          client.publish(process.env.TOPIC_PREFIX + '/storage/in', JSON.stringify(payload));
        });
      }
    });
  }

  const directoryPath = path.join(__dirname, '../uploads');
  console.log("File uploaded to:", directoryPath);
  res.send('File is uploaded.');
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


app.listen(3002, () =>
  logging(`[INFO] listening internal on port 3002`),
);