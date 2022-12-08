import fs from "fs";

export default class Player {
  
  client;
  interval = null;
  currentfile = null;
  
  constructor(mqttclient) {
    this.client = mqttclient;
  }

  play(filename) {
    let rawdata = null;
    try {
      rawdata = fs.readFileSync('./db/config1/' + filename);
    } catch (err) {
      console.log("File not found!");
      return;
    }
    if(this.currentfile != filename) {
      this.stop();
      this.currentfile = filename;
      console.log(this.currentfile)
    }
    let jsonObj = JSON.parse(rawdata);

    Object.prototype.getByIndex = function(index) {
      return this[Object.keys(this)[index]];
    };

    let currentframe = 0;
    this.client.publish('ledpanel/control', JSON.stringify({"command": "stream", "stream": `stream_001`}));
    this.interval = setInterval(() => {
      this.client.publish('ledpanel/stream/stream_001', JSON.stringify({"frame": jsonObj.getByIndex(currentframe)}));
      currentframe++;
      if(currentframe==Object.keys(jsonObj).length) currentframe = 0;
    }, 33); // 30 FPS

  }

  stop() {
    clearInterval(this.interval);
  }

}