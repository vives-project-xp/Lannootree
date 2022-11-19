import fs from 'fs'
import mqtt from 'mqtt'

import * as handel from './mqtt-handles.js'

export default () => {
  const caCert  = fs.readFileSync("./ca.crt");
  const options: mqtt.IClientOptions = {
    clientId: "led-client" + Math.random().toString(16).substring(2, 8),
    port: Number(process.env.MQTT_BROKER_PORT),
    host: process.env.MQTT_BROKER_URL,
    protocol: 'mqtts',
    rejectUnauthorized : true,
    ca: caCert,
    will: {
      qos: 2,
      topic: "status/led-client",
      payload: "Offline",
      retain: true
    }
  };

  const client = mqtt.connect(options);

  function logging(message: string, msgdebug: boolean = false) {
    if (!msgdebug) {
      console.log(message);
      client.publish('logs/led-client', message);
    }
    else if(msgdebug) {
      console.log(message);
    }
  }

  client.on('connect', function () {
    logging("INFO: mqtt connected");
    client.publish('status/led-client', 'Online', {retain: true});
    client.subscribe("ledpanel/control");
  });
  
  client.on('error', function(error) {
    logging("ERROR: mqtt:  " + error);
  });

  const ledpanelControllMap = new Map<string, any>([
    ["pause", handel.pause_leds],
    ["play",  handel.play_leds],
    ["stop",  handel.stop_leds],
    ["gif",   handel.play_gif],
    ["color", handel.set_color],
    // ["stream", handel.play_stream]
  ]);

  client.on('message', (topic, message) => {
    let data: any = message;

    try {
      data = JSON.parse(message.toString());
    } catch (error) {
      data = message;
    }

    switch (topic) {
      case "ledpanel/control": {
        if (ledpanelControllMap.has(data.command))
          ledpanelControllMap.get(data.command)(data);
        
        break;
      }
    }
  });

  return { client, logging };
}
