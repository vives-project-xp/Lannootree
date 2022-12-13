import dotenv from 'dotenv';
import mqtt from "mqtt";
import * as fs from 'fs';

dotenv.config({ path: '../.env' })

// MQTT ______________________________________________________________________________________
var caFile = fs.readFileSync("./ca.crt");
var clientcrt = fs.readFileSync("./client.crt");
var clientkey = fs.readFileSync("./client.key");
var options={
  clientId:"populator_" + Math.random().toString(16).substring(2, 8),
  port: process.env.MQTT_BROKER_PORT,
  host: process.env.MQTT_BROKER_URL,
  protocol:'mqtts',
  rejectUnauthorized : true,
  ca:caFile,
  cert: clientcrt,
  key: clientkey,
};
const client = mqtt.connect(options);

client.on('connect', function () {
  console.log("[INFO] mqtt connected")
  populateStorage();
});

async function populateStorage() {
  try {
    const files = await fs.promises.readdir("./src/populate/jsonfiles");
    for (const file of files) {
      const media_obj = {
        name: `${file.replace('')}`,
        category: "gif",
        description: `description_${file.replace(/\.json$|\.gif$/i, '')}`
      };
      const data = await fs.promises.readFile("./src/populate/jsonfiles/"+file);
      setTimeout(function() {
        client.publish('storage/in', JSON.stringify({"command": "add_file", "json": JSON.stringify(JSON.parse(data)), "name": media_obj.name, "category": media_obj.category, "description": media_obj.description}));
      }, 100);
    }
    setTimeout(function() {
      client.end();
      console.log("\n----------Storage populated----------");
      process.exit();
    }, files.length*110);
  } catch (err) {
    console.log(err);
  }
}