import net from 'net'
import mqtt from 'mqtt'
import fs from 'fs'

const caFile = fs.readFileSync("./ca.crt");
var options={
  clientId:"test-ledriver" + Math.random().toString(16).substring(2, 8),
  port: 8883,
  host: "lannootree.devbitapp.be",
  protocol:'mqtts',
  rejectUnauthorized : true,
  ca:caFile,
  will: {
    topic: "status/test-leddriver",
    payload: "Offline",
    retain: false
  }
};

const mqttClient = mqtt.connect(options);

mqttClient.on('connect', () => {
  mqttClient.publish("status/test-leddriver", "Online");
});

const client = net.createConnection("../led_driver/build/dev/lannootree.socket");
const logClient = net.createConnection("../led_driver/build/dev/logging.socket");

logClient.on("connect", () => {
  console.log("Connected to socket");
  mqttClient.publish("status/leddriver", 'Online');
});

logClient.on('data', (data) => {
  let msg = (data.toString()).split('\n');
  msg.forEach(m => {
    if (m !== "") {
      mqttClient.publish("logs/leddriver", m);
    }
  });
});

logClient.on('error', (err) => {
  console.log(err);
})


let raw = fs.readFileSync('./data_json.json')
let homerGif = JSON.parse(raw);

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

let homerFrames = Object.keys(homerGif);

console.log(homerFrames);

let frame = 0;
while (true) {
  console.log(`Sending frame ${frame}: [${homerGif[homerFrames[frame]][0]}, ${homerGif[homerFrames[frame]][1]}, ${homerGif[homerFrames[frame]][2]}]`);

  client.write(Uint8Array.from(homerGif[homerFrames[frame]]))

  frame = (frame + 1) % homerFrames.length;
  await sleep(250);
}