import * as sqlite3 from 'sqlite3';
import mqtt from "mqtt";
import * as fs from 'fs';
import express from 'express'

const db = new sqlite3.default.Database(':memory:');
const numberOfLogsToKeep = 2

var caFile = fs.readFileSync("ca.crt");
var mqttOptions={
  clientId:"log-parser" + Math.random().toString(16).substring(2, 8),
  port:8883,
  host:'lannootree.devbitapp.be',
  protocol:'mqtts',
  rejectUnauthorized : true,
  ca:caFile,
    will: {
        topic: "status/LOG-parser",
        payload: "Offline",
        retain: true
    }
}

db.serialize(() => {
    db.run("CREATE TABLE logs (id integer primary key autoincrement, container TEXT, timestamp TEXT, message TEXT)");

// MQTT___________________________________________________________________________________________________
    const client = mqtt.connect(mqttOptions);

    client.on('connect', function () {
        console.log("INFO: mqtt connected")
        client.publish('status/LOG-parser', 'Online', {retain: true});

        client.subscribe('logs/#', function (err) {
            if (err) {
                console.log("ERROR: Can't subscribe to toppic logs/#");
            }
        })
    })


client.on('message', function (topic, message) {
    let container = topic.substring(5);

    let today = new Date();
    let date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    let time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    let timestamp = date+' '+time;

    addLog(container, timestamp, message);
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
    }





// express___________________________________________________________________________________________________


const app = express()
const port = 3000

app.get('/', async (req, res) => {
    
    var params = []
    db.all("SELECT distinct container from logs", params, (err, rows) => {
        if (err) {
          res.status(400).json({"error":err.message});
          return;
        }
        let data = "<h1>Log Parser:</h1>";
        rows.forEach(row => {
            data += `<a href="${row.container}">${row.container}</a><br>`
        });
        res.send(data)
      });
});

app.get('/:container', (req, res) => {
    var params = []
    db.all(`SELECT * FROM logs WHERE container = '${req.params.container}'`, params, (err, rows) => {
        if (err) {
          res.status(400).json({"error":err.message});
          return;
        }
        let data = `<h1>Log Parser:</h1>
        <h2>Logs for: ${req.params.container}</h2>
        <p><a href="/">Go back</a></p>
        <table>
            <tr>
                <th>Timestamp</th>
                <th>Message</th>
            </tr>`;
        rows.forEach(row => {
            data += `<tr>
                <td>${row.timestamp}</td>
                <td style="border-left: solid;">${row.message}</td>
            </tr>`
        });
        data += `</table>`
        res.send(data)
      });
  });




app.listen(port, () => {
  console.log(`INFO: Log-parser listening on port ${port}`)
})
// __________________________________________________________________________________________________________
});

// db.close();
