import dotenv from 'dotenv'
import mqtt from "mqtt";
import * as fs from 'fs';
import express from 'express'
import * as sqlite3 from 'sqlite3';
import WebSocket, { WebSocketServer } from 'ws';

dotenv.config({ path: '../.env' })
const websocket = new WebSocketServer({ port: 3000 });
var statusBuffer = {};

// MQTT___________________________________________________________________________________________________
var caFile = fs.readFileSync("ca.crt");
var mqttOptions={
  clientId:"admin-api_" + Math.random().toString(16).substring(2, 8),
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
    logging("[INFO] mqtt connected")
    client.publish('status/admin-api', 'Online', {retain: true});
    client.subscribe('logs/#');
    client.subscribe('status/#');
})
    
    

// ___________________________________________________________________________________________________
// Log parser
// ___________________________________________________________________________________________________
const db = new sqlite3.default.Database('./db/logs.sqlite');
const numberOfLogsToKeep = process.env.ADMIN_API_NUMBER_OF_LOGS_TO_KEEP

db.serialize(() => {
    db.run("CREATE TABLE IF NOT EXISTS logs (id integer primary key autoincrement, container TEXT, timestamp TEXT, message TEXT)");


client.on('message', function (topic, message) {
  if(topic.startsWith('logs')){
    let container = topic.substring(5);

    let today = new Date();
    let date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    let time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    let timestamp = date+' '+time;

    addLog(container, timestamp, message);
  }
  if(topic.startsWith('status')){
    let container = topic.substring(7);
    statusBuffer[container] = message.toString();

    websocket.clients.forEach(function each(client) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(
          {status: {
            "container": container,
            "status": message.toString()
          }}
        ));
      }
    });
  }
})
// ________________________________________________________________________________________________________

    function addLog(container, timestamp, message){
        db.run(`INSERT INTO logs (container, timestamp, message) VALUES(?, ?, ?)`, [`${container}`,`${timestamp}`,`${message}`], (err) => {
            if(err) {
                return console.log(err.message); 
            }
        })

        db.run(`DELETE FROM logs
        where container = ? AND
        id not in (
            select id
            from logs
            WHERE container = ?
            order by id DESC
            limit ?
        )`, [`${container}`, `${container}`, numberOfLogsToKeep]);

        websocket.clients.forEach(function each(client) {
          if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(
              {log: {
                "container": container,
                "timestamp": timestamp,
                "message": message.toString()
              }}
            ));
          }
        });
    }
// Websocket log pushing___________________________________________________________________________________________

websocket.on('connection', (ws, req) => {
  logging('[INFO] Websocket connection from: ' + req.headers['x-forwarded-for']);

  db.all(`SELECT * FROM logs ORDER BY id ASC`, [], (err, rows) => {
    rows.forEach(row => {
      // console.log(row);
      ws.send(JSON.stringify({log: row}));
    });
  });

  Object.entries(statusBuffer).forEach(entry => {
    const [key, value] = entry;
    ws.send(JSON.stringify(
      {status: {
        "container": key,
        "status": value
      }}
    ));
  });

  ws.on("message", (data) => {
    let message = JSON.parse(data.toString());

    if (message.type === 'config') {
      logging(`[INFO] Received config: ${message.config}`)
      client.publish('controller/config', JSON.stringify(message.config));
    }

  })

  ws.on("close", () => {
      logging("[INFO] Websocket client disconnected")
  });
});


});
// express___________________________________________________________________________________________________
const app = express()
const port = 3001

app.use(express.json())
app.post('/admin/config', async (req, res) => {

    logging("[INFO] recieved new json from: "  + req.headers['x-forwarded-for']);
    
    res.sendStatus(200);
});

app.listen(port, () => {
  logging(`[INFO] admin-api listening on port ${port}`)
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