import dotenv from 'dotenv'
import mqtt from "mqtt";
import * as fs from 'fs';
import express from 'express'

dotenv.config({ path: '../.env' })

// MQTT___________________________________________________________________________________________________
var caFile = fs.readFileSync("ca.crt");
var mqttOptions={
  clientId:"admin-api" + Math.random().toString(16).substring(2, 8),
  port: process.env.MQTT_BROKER_PORT,
  host: process.env.MQTT_BROKER_URL,
  protocol:'mqtts',
  rejectUnauthorized : true,
  ca:caFile,
    will: {
        topic: "status/admin-api",
        payload: "Offline",
        retain: true
    }
}
const client = mqtt.connect(mqttOptions);

client.on('connect', function () {
    logging("INFO: mqtt connected")
    client.publish('status/admin-api', 'Online', {retain: true});
})
    
    
// express___________________________________________________________________________________________________
const app = express()
const port = 3000

app.use(express.json())
app.post('/', async (req, res) => {

    logging("INFO: recieved new json from: "  + req.headers['x-forwarded-for']);
    client.publish('controller/config', JSON.stringify({requestBody: req.body}));
    
    res.sendStatus(200);
});

app.listen(port, () => {
  logging(`INFO: admin-api listening on port ${port}`)
})


function logging(message, msgdebug = false){
    if (!msgdebug) {
      console.log(message);
      client.publish('logs/admin-api', message);
    }
    else if(msgdebug && debug) {
      console.log(message);
    }
  }