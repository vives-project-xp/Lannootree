const mqtt = require('mqtt');
const dotenv = require('dotenv');
const express = require('express');
const multer = require("multer");


const fs = require('fs');

dotenv.config({ path: '../.env' });

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
    will: {
        topic: "status/uploader-api",
        payload: "Offline",
        retain: true
    }
};



const client = mqtt.connect(options);

const app = express();

var mqtt_connected = false;


client.on('connect', () => {
    logging("[INFO] mqtt connected")
    client.publish('status/uploader-api', 'Online', {retain: true});

    client.subscribe('voronoi/in');

    mqtt_connected = true;
});

app.use(express.static('public'));


app.post('/uploader-api', (req, res) => {
    logging('[INFO] you reached the uploader-api');
});

const upload = multer({
  dest: "./uploads"
  // you might also want to set some limits: https://github.com/expressjs/multer#limits
});


app.post("/upload",upload.single("file"),(req, res) => { //file is name in de form of frontend
    const tempPath = req.file.path;
    const targetPath = path.join(__dirname, "./uploads/image.png");

    if (path.extname(req.file.originalname).toLowerCase() === ".png") {
      fs.rename(tempPath, targetPath, err => {
        if (err) return handleError(err, res);

        res
          .status(200)
          .contentType("text/plain")
          .end("File uploaded!");
      });
    } else {
      fs.unlink(tempPath, err => {
        if (err) return handleError(err, res);

        res
          .status(403)
          .contentType("text/plain")
          .end("Only .png files are allowed!");
      });
    }
  }
);

app.get("/image", (req, res) => {
  res.sendFile(path.join(__dirname, "./uploads/image.png"));
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