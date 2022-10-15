import mqtt from "mqtt";
import * as fs from 'fs';
import express from 'express'


// MQTT___________________________________________________________________________________________________
var caFile = fs.readFileSync("ca.crt");
var mqttOptions={
  clientId:"config-api" + Math.random().toString(16).substring(2, 8),
  port:8883,
  host:'lannootree.devbitapp.be',
  protocol:'mqtts',
  rejectUnauthorized : true,
  ca:caFile,
    will: {
        topic: "status/config-api",
        payload: "Offline",
        retain: true
    }
}
const client = mqtt.connect(mqttOptions);

client.on('connect', function () {
    logging("INFO: mqtt connected")
    client.publish('status/config-api', 'Online', {retain: true});
})
    
    
// express___________________________________________________________________________________________________
const app = express()
const port = 3000

app.use(express.json())
app.post('/json', async (req, res) => {

    logging("reicieved new json from: "  + req.headers['x-forwarded-for']);
    client.publish('controller/config', JSON.stringify({requestBody: req.body}));
    
    res.sendStatus(200);
});

app.listen(port, () => {
  logging(`INFO: config-api listening on port ${port}`)
})


function logging(message, msgdebug = false){
    if (!msgdebug) {
      console.log(message);
      client.publish('logs/client-api', message);
    }
    else if(msgdebug && debug) {
      console.log(message);
    }
  }