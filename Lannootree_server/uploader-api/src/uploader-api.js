const mqtt = require('mqtt');
const dotenv = require('dotenv');
const express = require('express');

const fs = require('fs');

dotenv.config({ path: '../.env' });


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
    logging("INFO: mqtt connected")
    client.publish('status/uploader-api', 'Online', {retain: true});

    client.subscribe('voronoi/in');

    mqtt_connected = true;
});


app.post('/uploader-api', (req, res) => {
    console.log('you reached the uploader-api');
});


// app.use(fileUpload({
//     createParentPath: true,
//     limits: { 
//         fileSize: 2000 * 1024 * 1024 * 1024 //2GB max file size
//     },
// }));


app.post('/upload', (req, res) => {

    logging('INFO: HTTP POST received from ' + req.headers['x-forwarded-for']);
    
    // try {
    //     if(!req.files && mqtt_connected) {
    //         client.publish(
    //             'ffmpeg/in', 
    //             {
    //                 status: false,
    //                 message: 'No file uploaded'
    //             } 
    //         );        
                    
    //     } else {
            //Use the name of the input field (i.e. "avatar") to retrieve the uploaded file
    let file = req.files.file;
    //Use the mv() method to place the file in upload directory (i.e. "uploads")
    file.mv('./temp/' + file.name);

        //     //send response to mqtt
        //     if(mqtt_connected){
        //         client.publish(
        //             'ffmpeg/in', 
        //             {
        //                 status: true,
        //                 message: 'File is uploaded',
        //                 data: {
        //                     name: file.name,
        //                     mimetype: file.mimetype,
        //                     size: file.size,
        //                     file
        //                 }
        //             }
        //         );
        //     } 
        // }
    // } catch (err) {
    //     res.status(500).send(err);
    // }
    res.status(200).send();

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
  console.log(`app listening on port ${process.env.PORT_EXPRESS}`),
);  