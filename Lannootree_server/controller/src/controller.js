import JsonGenerator from "./json_generator.js";
import DevCheck from './dev.js';

import mqtt from "mqtt";
import fs from "fs";
import dotenv from "dotenv";
dotenv.config({ path: '../../.env' });

const debug = false;
var production_server = process.env.PRODUCTION_SERVER
const developement_time = process.env.CONTROLLER_DEV_SECONDS;

// When you start the controller local with npm run dev, the DevCheck will make sure that
// the controller running on the server in docker will automatically go in sleep-mode
// to avoid conflicts with the local controller
var instanceName = "controller";
if (typeof production_server == 'undefined') {
  production_server = false;
  instanceName = "controller-dev";
}
const devCheck = new DevCheck(production_server, developement_time);

// MQTT______________________________________________________________

var caFile = fs.readFileSync("./ca.crt");
var clientcrt = fs.readFileSync("./client.crt");
var clientkey = fs.readFileSync("./client.key");
var options = {
  clientId:"controller_" + Math.random().toString(16).substring(2, 8),
  protocol: process.env.MQTT_BROKER_PROTOCOL,
  will: {
      topic: "status/" + instanceName,
      payload: "Offline",
      retain: true
  }
};

if (process.env.MQTT_BROKER_EXTERNAL === 'true') {
  if (process.env.NO_CREDENTIALS === 'false') {
    options.password = process.env.MQTT_BROKER_PASSWORD;
    options.user = process.env.MQTT_BROKER_USER;
  }
  options.port = process.env.MQTT_BROKER_PORT;
  options.host = process.env.MQTT_BROKER_URL;
} 
else {
  options.port = process.env.MQTT_BROKER_LOCAL_PORT;
  options.host = process.env.MQTT_BROKER_LOCAL_URL;
  options.rejectUnauthorized = false;
  options.ca = caFile;
  options.cert = clientcrt;
  options.key = clientkey;
}

const client = mqtt.connect(options);

const topics = [
  "controller/in"
]

client.on('connect', function () {
  if (process.env.MQTT_BROKER_EXTERNAL === 'true') {
    logging("[INFO] mqtt connected to external broker") }
    else { 
      logging("[INFO] mqtt connected to local broker")
    }
  client.subscribe("status/controller-dev");
  
  devCheck.on('startup', () => {
    topics.forEach(topic => {
      client.subscribe(topic);
    });
    client.publish("status/" + instanceName, 'Online', {retain: true});
    logging("[INFO] controller started")
    sendStatus();
  });
  
  devCheck.on('sleep', () => {
    client.publish("status/" + instanceName, 'Sleep', {retain: true});
    topics.forEach(topic => {
      client.unsubscribe(topic);
    });
    logging("[WARNING] a dev controller started, going to sleep mode")
  });
  
  devCheck.on('timer', () => {
    client.publish("status/" + instanceName, 'Starting', {retain: true});
    logging(`[INFO] dev controller went offline, starting in ${developement_time} seconds`)
  });

  devCheck.Start();
});

client.on('close', function () {
  logging("[INFO] mqtt connection closed");
});

client.on('offline', function () {
  logging("[INFO] mqtt connection offline");
});

client.on('end', function () {
  logging("[INFO] mqtt connection ended");
});

client.on('error', function(error) {
  logging("[ERROR] mqtt:  " + error);
});

client.on('message', function (topic, message) {
  let data = message;
  try {
    data = JSON.parse(message.toString());
  } catch (error) {
    data = message;
  }
  
  switch (topic) {
    case "controller/in":
      switch(data.command) {
        case "ontime": set_ontime(data.ontime); break;
        case "media": update_media(data.media); break;
        case "pause": pause_leds(); break;
        case "play": play_leds(); break;
        case "stop": stop_leds(); break;
        case "color": set_color(data.red, data.green, data.blue); break;
        case "play_media": ask_play_media(data.media_id); break;
        case "acceptstream": play_media(data.stream, data.id); break;
      }
    case "status/controller-dev": devCheck.Update(data); break;
  }
  if (topic == "status/" + instanceName  && message == "restart") {
    crashApp("restarted via mqtt command");
  }
});

// CONTROLLER______________________________________________________________

var on_time = '08:00-18:00';                                                // default ontime
var ledpanelOn = false;                                                     // if false, most of the LedPanel control functions will be blocked
if(checkTimeBetweenSetpoints()) turnOnLedPanel();                           // when starting, check if current time is between on_time, if so... turn on the LedPanel
else sendColorLedPanel(0,0,0);                                              // if not, send offcolor to LedPanel
client.publish('storage/in', JSON.stringify({"command": "send_media"}));    // On startup: ask storage to send current available media
client.publish('storage/in', JSON.stringify({"command": "stop_current"}));  // On startup: ask starge to stop currently playing media

var status = "stop";            // Default status is stopped
var paused = true;              // Controller is paused
var activeStream = null;        // Active stream topic (storage streams under that topic, LedClient listens on that topic)
var current_media_id = null;    // Media id (database id) from currently playing media
var media = [];                 // Local stored media array (received from storage)

function update_media(new_media) {  // Function to update the media array
  media = new_media;
  sendStatus();
}

setInterval(() => {   // Interval that executes every 20 seconds
  
  // The controller checks if the LedPanel should turn on or off
  if(checkTimeBetweenSetpoints() && !ledpanelOn) turnOnLedPanel();
  else if(!checkTimeBetweenSetpoints() && ledpanelOn) turnOffLedPanel();

  // The controller asks the storage to send its stored media. It will send it back to the controller under the controller/in topic with the command "media"
  client.publish('storage/in', JSON.stringify({"command": "send_media"}));

  // The status of the variables and the stored media get sent every 20 seconds to the frontend (makes sure the frontend is up-to-date)
  sendStatus();

}, 20*1000);

// This function checks if the current time is between the on_time variable or not to automatically turn off/on the LedPanel
// EX: if its 12:45 and the ontime is '08:00-18:00', the function returns true
// EX: if its 05:78 and the ontime is '08:00-18:00', the function returns false
function checkTimeBetweenSetpoints() {
  const [time_begin, time_end] = on_time.split('-');
  const [hours_begin, minutes_begin] = time_begin.split(':');
  const date_begin = new Date();
  date_begin.setHours(hours_begin,minutes_begin,0,0);
  const [hours_end, minutes_end] = time_end.split(':');
  const date_end = new Date();
  date_end.setHours(hours_end,minutes_end,0,0);
  const date_now = new Date();
  if(date_begin <= date_end) {   // BEGIN   NOW    END
    if(date_now > date_begin && date_now < date_end) return true;
    else return false;
  }
  else {                        // END   NOW    BEGIN
    if(date_now > date_end && date_now < date_end) return true;
    else return false;
  }
}

// With this function, you can set the on_time variable. It checks if the string is valid or not
function set_ontime(ontime) {
  const date_begin = new Date();
  const date_end = new Date();
  if(/^(2[0-3]|[0-1]?[\d]):[0-5][\d]-(2[0-3]|[0-1]?[\d]):[0-5][\d]$/.test(ontime)) {
    const [time_begin, time_end] = ontime.split('-');
    const [hours_begin, minutes_begin] = time_begin.split(':');
    date_begin.setHours(hours_begin,minutes_begin,0,0);
    const [hours_end, minutes_end] = time_end.split(':');
    date_end.setHours(hours_end,minutes_end,0,0);
    if(date_begin >= date_end) logging(`[ERROR] begin_time must come before end_time ('${ontime}')`);
    else {
      var time_difference = Math.abs(date_begin-date_end);
      if(time_difference <= 3600000) logging(`[WARNING] ontime less than 1 hour? Ontime set: '${ontime}'`);
      else logging(`[INFO] ontime set: '${ontime}'`);
      on_time = ontime;
      sendStatus();
      if(checkTimeBetweenSetpoints()) turnOnLedPanel();
      else ledpanelOn = turnOffLedPanel();
    }
  }
  else logging(`[ERROR] Possible wrong ontime format ('${ontime}'), must be like: '08:00-18:00'`)
}

// Function to turn on the LedPanel
function turnOnLedPanel() {
  ledpanelOn = true;
  sendColorLedPanel(50,0,0);  // When turned on (idle-state), the color red will be shown
  logging(`[INFO] LedPanel turned ON (ontime-schedule: ${on_time})`);
}

// Function to turn off the LedPanel
function turnOffLedPanel() {
  stop_leds();
  ledpanelOn = false;
  logging(`[INFO] LedPanel turned OFF (ontime-schedule: ${on_time})`);
}

// Function to pause the LedPanel
function pause_leds() {
  if(ledpanelOn) {  // Can only be executed when ledpanelOn is true (if the time is between on_time)
    client.publish('storage/in', JSON.stringify({"command": "pause_current"})); // Ask the storage to pause the current stream
    status = "pause";
    paused = true;
    sendStatus();
    logging("[INFO] LEDS paused");
  }
  else logging(`[WARNING] CANT PAUSE, LedPanel is OFF (ontime-schedule: ${on_time})`);
}

// When paused, this function can resume the LedPanel again
function play_leds() {
  if(ledpanelOn) {
    client.publish('storage/in', JSON.stringify({"command": "play_current"})); // Ask the storage to resume the current stream
    status = "playing";
    paused = false;
    sendStatus();
    logging("[INFO] LEDS resumed");
  }
  else logging(`[WARNING] CANT PLAY, LedPanel is OFF (ontime-schedule: ${on_time})`);
}

// This function sends 5 times a static color to the LedPanel (just to be sure :) )
function sendColorLedPanel(r,g,b) {
  for(let i = 0; i<5; i++) {
    client.publish('ledpanel/control', JSON.stringify({"command": "color", "red": r, "green": g, "blue": b}));
  }
}

// This function stops the LedPanel
function stop_leds() {
  if(ledpanelOn) {
    client.publish('storage/in', JSON.stringify({"command": "stop_current"}));  // Ask the storage to stop the current stream
    sendColorLedPanel(0,0,0); // Send color black to the LedPanel, it won't be lit up anymore
    status = "stop";
    paused = true;
    activeStream = null;
    current_media_id = null;
    sendStatus();
    logging("[INFO] stopped media");
  }
  else logging(`[WARNING] CANT STOP, LedPanel is OFF (ontime-schedule: ${on_time})`);
}

// This function sends a static color to the LedPanel
function set_color(red, green, blue) {
  if(ledpanelOn) {
    sendColorLedPanel(red, green, blue);
    current_media_id = null;
    sendStatus();
    logging(`[INFO] static color (${red},${green},${blue}) set`);
  }
  else logging(`[WARNING] CANT SET COLOR, LedPanel is OFF (ontime-schedule: ${on_time})`);
}

// If being called, this function asks the storage to begin playing a stream for some media with a specific media_id.
// The storage will perform some checks on the media_id, and if everything's allright, it will give a response under the controller/in topic and command 'acceptstream'.
// Only then, the play_media function will be called (see below)
function ask_play_media(media_id) {
  if(ledpanelOn) {
    if(media_id == current_media_id) {
      logging(`[INFO] MEDIA ${media_id} IS ALREADY PLAYING`);
    } else {
      let streamID = generateStreamID();  // This generated a steamID (goes from 000 to 999)
      client.publish('storage/in', JSON.stringify({"command": "play", "id": media_id, "streamtopic": `stream_${streamID}`})); // Ask storage to play media_id ... on streamtopic ...
    }
  }
  else logging(`[WARNING] CANT PLAY MEDIA, LedPanel is OFF (ontime-schedule)`);
}

// If the storage accepted the request (see 'ask_play_media'), it will return the topic and media_id that the 'ask_play_media' function gave.
// At this point, the storage is already streaming the media with media_id ... under that topic 
function play_media(topic, id) {
  client.publish('ledpanel/control', JSON.stringify({"command": "stream", "stream": topic})); // Let the LedPanel listen on that streamtopic
  current_media_id = id;
  activeStream = topic;
  status = "playing";
  paused = false;
  sendStatus();
  logging(`[INFO] playing media (${id})`);
}

// This function generates a streamID between 000 and 999
var currentID = 0;
function generateStreamID() {
  function padLeft(nr, n, str){
    return Array(n-String(nr).length+1).join(str||'0')+nr;
  }
  if(currentID == 999) currentID = 0;
  currentID++;
  return padLeft(currentID,3);
}

// This function sends the value of the stored variables to the frontend on the controller/status topic so it can be updated
function sendStatus() {
  let obj = JsonGenerator.statusToJson(
    status,
    paused,
    on_time,
    activeStream,
    current_media_id,
    media
  );
  client.publish('controller/status', JSON.stringify(obj));
}

// general__________________________________________________________________
function logging(message, msgdebug = false) {
  if (!msgdebug) {
    console.log(message);
    client.publish('logs/' + instanceName, message);
  }
  else if(msgdebug && debug) {
    console.log(message);
  }
}

function crashApp(message) {
  logging('[FATAL] ' + message);
  client.publish('logs/' + instanceName, 'FATAL: ' + message, (error) => {
    process.exit(1);
  })
}