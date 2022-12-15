import fs from "fs";

export default class Player {
  
  client;
  interval = null;
  currentfilepathpath = null;
  paused = false;
  
  constructor(mqttclient) {
    this.client = mqttclient;
  }

  play(filepath, streamTopic, id) {
    this.paused = false;
    let rawdata = null;
    try {
      rawdata = fs.readFileSync(filepath);
    } catch (err) {
      console.log("File not found!");
      return;
    }
    if(this.currentfilepath != filepath) {
      this.stop();
      this.currentfilepath = filepath;
    }
    let jsonObj = JSON.parse(rawdata);

    Object.prototype.getByIndex = function(index) {
      return this[Object.keys(this)[index]];
    };

    let currentframe = 0;
    this.client.publish('controller/in', JSON.stringify({"command": "acceptstream", "stream": streamTopic, "id": id}));
    this.interval = setInterval(() => {
      if(!this.paused) {
        this.client.publish('ledpanel/stream/'+streamTopic, JSON.stringify({"frame": jsonObj.getByIndex(currentframe)}));
        currentframe++;
        if(currentframe==Object.keys(jsonObj).length) currentframe = 0;
      }
    }, 33); // 30 FPS

  }

  pause() {
    this.paused = true;
  }

  unpause() {
    this.paused = false;
  }

  stop() {
    clearInterval(this.interval);
  }

}