import net from 'net'
import mqtt from 'mqtt'
import fs from 'fs'

// const caFile = fs.readFileSync("./ca.crt");
// var options={
//   clientId:"test-ledriver" + Math.random().toString(16).substring(2, 8),
//   port: 8883,
//   host: "lannootree.be",
//   protocol:'mqtts',
//   rejectUnauthorized : true,
//   ca:caFile,
//   will: {
//     topic: "status/test-leddriver",
//     payload: "Offline",
//     retain: false
//   }
// };

// const mqttClient = mqtt.connect(options);

// mqttClient.on('connect', () => {
//   mqttClient.publish("status/test-leddriver", "Online");
// });

const client = net.createConnection("/var/run/lannootree.socket");
// const logClient = net.createConnection("../led_driver/build/dev/logging.socket");

// logClient.on("connect", () => {
//   console.log("Connected to socket");
//   mqttClient.publish("status/leddriver", 'Online');
// });

// logClient.on('data', (data) => {
//   let msg = (data.toString()).split('\n');
//   msg.forEach(m => {
//     if (m !== "") {
//       mqttClient.publish("logs/leddriver", m);
//     }
//   });
// });

// logClient.on('error', (err) => {
//   console.log(err);
// })




let rawHomer = fs.readFileSync('./proccessed/homer.gif.json');
let rawPBJ = fs.readFileSync('./proccessed/PBJ_time.gif.json');
let rawColorWheel = fs.readFileSync('./proccessed/colorwheel.gif.json')
let rawHomerJoint = fs.readFileSync('./proccessed/HomerJoint.gif.json')
let rawLionFall = fs.readFileSync('./proccessed/lion_fall.gif.json')
let rawHomerDonut = fs.readFileSync('./proccessed/homer_donut.gif.json')
let rawSillVL = fs.readFileSync('./proccessed/SilleVL.gif.json')
let rawVives = fs.readFileSync('./proccessed/Vives.gif.json')
let rawRick = fs.readFileSync('./proccessed/rickroll-roll.gif.json')

let gifs = [
  JSON.parse(rawVives),
  JSON.parse(rawHomer),
  JSON.parse(rawPBJ),
  JSON.parse(rawColorWheel),
  JSON.parse(rawHomerJoint),
  JSON.parse(rawLionFall),
  JSON.parse(rawHomerDonut),
  JSON.parse(rawSillVL),
  JSON.parse(rawRick)
];

let speeds = [
  60,
  80,
  90,
  90,
  50,
  60,
  60,
  50,
  50
]

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

let current = Math.floor(Math.random() * gifs.length);

while (true) {
  current = Math.floor(Math.random() * gifs.length);

  let frame = 0;
  let Gif = gifs[current]
  let Frames = Object.keys(Gif)

  
  let i = 0;
  while (true) {
    client.write(Uint8Array.from(Gif[Frames[frame]]))
    frame = (frame + 1) % Frames.length;
  
    if (i == 1 && frame == Frames.length - 1) break;

    if (frame == Frames.length - 1) i++;

    await sleep(speeds[current]);
  }

  current = (current + 1) % gifs.length;

}
