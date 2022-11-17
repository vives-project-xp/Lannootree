import fs from 'fs'
import mqtt from 'mqtt'

import * as handel from './mqtt-handles.js'

export default () => {
  const caCert  = fs.readFileSync("ca.crt");
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
      client.publish('logs/controller', message);
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

  client.on('message', (topic, message) => {
    let data: any = message;
    try {
      data = JSON.parse(message.toString());
    } catch (error) {
      data = message;
    }
    switch (topic) {
      case "ledpanel/control":
        switch(data.command) {
          case "pause": handel.pause_leds(); break;
          case "play": handel.play_leds(); break;
          case "stop": handel.stop_leds(); break;
          case "color": handel.set_color(data.red, data.green, data.blue); break;
          case "gif": handel.play_gif(data.gif_number); break;
          case "stream": handel.play_stream(data.stream, client); break;
        }
        break;
      // case "ledpanel/stream": devCheck.Update(data); break;
      // case activeStreamTopic:
      //   leddriver.frame_to_ledcontroller(data);
      //   break;
    }
    
  });

  return { client, logging };
}
