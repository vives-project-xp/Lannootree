import fs from 'fs';
import mqtt from 'mqtt';
import { createClient } from 'redis';

const caCert = fs.readFileSync("../../../certs/ca.crt");
const clientcrt = fs.readFileSync("../../../certs/client/client.crt");
const clientkey = fs.readFileSync("../../../certs/client/client.key");

const mqttOptions = {
  clientId: `steamer`,
  port: 8883,
  host: "lannootree.devbitapp.be",
  protocol: 'mqtts',
  rejectUnauthorized: true,
  ca: caCert,
  cert: clientcrt,
  key: clientkey,
};

const mqtt_client = mqtt.connect(mqttOptions);
mqtt_client.on('connect', () => {
  console.log('Connected to mqtt');
}); 

mqtt_client.on('error', () => {
  console.error("Failed to connect")
})

const redis_client = createClient({
  url: 'redis://localhost:6379'
});

redis_client.connect();

const main = async function() {
  console.log("Main")
  mqtt_client.publish("ledpanel/control", JSON.stringify({ "command": "stream", "stream": "stream_0" }));
  
  while (true) {
    const data = await redis_client.brPop("nextframe", 0);
    // console.log(data);
    mqtt_client.publish('ledpanel/stream/stream_0', data.element);
  }
}

main();

