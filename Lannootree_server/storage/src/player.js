import fs from "fs";

// This class will actually stream the stored processed json file on the FS frame by frame over MQTT (controlled by the storage)
export default class Player {
  
  client;
  interval = null;  // makes sure the current interval can be cleared
  paused = false;
  
  constructor(mqttclient) {
    this.client = mqttclient; // store the MQTT client provided by the storage (makes publishing over MQTT possible without duplicating the initialisation code)
  }

  // This is the play_method, it will read the stored json file and stream it frame by frame at 30 FPS over the given streamTopic
  play(filepath, streamTopic, id) {
    this.paused = false;
    let rawdata = null;
    try {
      rawdata = fs.readFileSync(filepath);              // Read the content of the file
    } catch (err) {
      console.log("File not found!");
      return;
    }
    this.stop();
    let jsonObj = JSON.parse(rawdata);                  // Parse to a json object

    // the jsonObj looks like this: ["frame0": [15,15,15,44,54,4,54,5,45], "frame1": [45,55,45,45,42,21], ...]
    // Following function enables us to get [15,15,15,44,54,4,54,5,45] out of "frame0" by calling jsonObj.getByIndex(0)
    // This enables easy looping over all the frames
    Object.prototype.getByIndex = function(index) {     
      return this[Object.keys(this)[index]];
    };

    let currentframe = 0;
    this.client.publish(process.env.TOPIC_PREFIX + '/controller/in', JSON.stringify({"command": "acceptstream", "stream": streamTopic, "id": id})); // Only now, accept the request by the controller to let the led-client listen on the streamtopic
    this.interval = setInterval(() => {
      if(!this.paused) {  // only stream when paused is false
        this.client.publish(process.env.TOPIC_PREFIX + '/ledpanel/stream/'+streamTopic, JSON.stringify({"frame": jsonObj.getByIndex(currentframe)})); // Send the current frame over the topic
        currentframe++;
        if(currentframe==Object.keys(jsonObj).length) { // when currentframe is lastframe+1
          this.client.publish(process.env.TOPIC_PREFIX + '/storage/out', JSON.stringify({"message": "endOfGIF"}));  // Not used yet, but this could be used by ex. the controller to wait for a long gif/movie while blocking other functions so the progress isn't lost.
          currentframe = 0; // reset the currentframe, keep looping the gif
        } 
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
    clearInterval(this.interval); // Stop sending the frames over the topic
  }

}