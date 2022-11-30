import JsonGenerator from "./json_generator.js";
import DevCheck from './dev.js';

import mqtt from "mqtt";
import fs from "fs";
import dotenv from "dotenv";
dotenv.config({ path: '../.env' });

const debug = false;
var production_server = process.env.PRODUCTION_SERVER
const developement_time = process.env.CONTROLLER_DEV_SECONDS;

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
  port: process.env.MQTT_BROKER_PORT,
  host: process.env.MQTT_BROKER_URL,
  protocol:'mqtts',
  rejectUnauthorized : true,
  ca:caFile,
  cert: clientcrt,
  key: clientkey,
  will: {
      topic: "status/" + instanceName,
      payload: "Offline",
      retain: true
  }
};
const client = mqtt.connect(options);

const topics = [
  "controller/in"
]

client.on('connect', function () {
  logging("[INFO] mqtt connected");
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
        case "pause": pause_leds(); break;
        case "play": play_leds(); break;
        case "stop": stop_leds(); break;
        case "color": set_color(data.red, data.green, data.blue); break;
        case "previous": previous_gif(); break;
        case "next": next_gif(); break;
        case "show_media": set_media(data.media_name); break;
        // case "play_effect": set_effect(data.effect_name); break;
        case "play_effect": play_gif(data.effect_name); break;
      }
    case "status/controller-dev": devCheck.Update(data); break;
  }
  if (topic == "status/" + instanceName  && message == "restart") {
    crashApp("restarted via mqtt command");
  }
});

// CONTROLLER______________________________________________________________

var on_time = '08:00-18:00';
var ledpanelOn = false;
if(checkTimeBetweenSetpoints()) turnOnLedPanel();

var status = "stop";
var paused = true;  // later opvragen aan ledclient, niet lokaal bijhouden
var playing_gif = 0;  // Later ook verwijderen
var activeStream = null;
var current_media_type = null;
var current_media_id = null;
var media = [];

function populateMedia0to20gifs() {  // voorlopige functie (VERWIJDEREN)
  for (let i = 0; i < 21; i++) {
    let media_obj = {
      id: i,
      name: `gif_${i}`,
      category: "gif",
      description: `description_gif_${i}`
    };
    media.push(media_obj);
  }
}
populateMedia0to20gifs();

setInterval(() => {
  
  if(checkTimeBetweenSetpoints() && !ledpanelOn) turnOnLedPanel();
  else if(!checkTimeBetweenSetpoints() && ledpanelOn) turnOffLedPanel();

  if(ledpanelOn && !paused) next_gif();  // van gif veranderen terwijl het paneel aan staat

  sendStatus(); // herhaaldelijke sendStatus() om de frontends zeker up-to-date te houden

}, 60*1000); // EVERY MINUTE

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

function turnOnLedPanel() {
  ledpanelOn = true;
  logging(`[INFO] LedPanel turned ON (ontime-schedule: ${on_time})`);
}

function turnOffLedPanel() {
  stop_leds();
  ledpanelOn = false;
  logging(`[INFO] LedPanel turned OFF (ontime-schedule: ${on_time})`);
}

function pause_leds() {
  if(ledpanelOn) {
    client.publish('ledpanel/control', JSON.stringify({"command": "pause"}));
    status = "pause";
    paused = true;
    sendStatus();
    logging("[INFO] LEDS paused");
  }
  else logging(`[WARNING] CANT PAUSE, LedPanel is OFF (ontime-schedule: ${on_time})`);
}

function play_leds() {
  if(ledpanelOn) {
    client.publish('ledpanel/control', JSON.stringify({"command": "play"}));
    status = "playing";
    paused = false;
    sendStatus();
    logging("[INFO] LEDS resumed");
  }
  else logging(`[WARNING] CANT PLAY, LedPanel is OFF (ontime-schedule: ${on_time})`);
}

function stop_leds() {
  if(ledpanelOn) {
    client.publish('ledpanel/control', JSON.stringify({"command": "stop"}));
    status = "stop";
    paused = true;
    activeStream = null;
    current_media_type = null;
    current_media_id = null;
    sendStatus();
    logging("[INFO] stopped media");
  }
  else logging(`[WARNING] CANT STOP, LedPanel is OFF (ontime-schedule: ${on_time})`);
}

function set_color(red, green, blue) {
  if(ledpanelOn) {
    client.publish('ledpanel/control', JSON.stringify({"command": "color", "red": red, "green": green, "blue": blue}));
    current_media_type = `static_color_${red}_${green}_${blue}`;
    current_media_id = null;
    sendStatus();
    logging(`[INFO] static color (${red},${green},${blue}) set`);
  }
  else logging(`[WARNING] CANT SET COLOR, LedPanel is OFF (ontime-schedule: ${on_time})`);
}

function previous_gif() {
  if(ledpanelOn) {
    if(playing_gif == 0) playing_gif = 20;
    else playing_gif--;
    current_media_type = "gif";
    current_media_id = playing_gif;
    activeStream = null;
    status = "playing";
    paused = false;
    client.publish('ledpanel/control', JSON.stringify({"command": "gif", "gif_number": playing_gif}));
    sendStatus();
    logging(`[INFO]: playing gif ${playing_gif}`);
  }
  else logging(`[WARNING] CANT SET PREVIOUS GIF, LedPanel is OFF (ontime-schedule: ${on_time})`);
}

function next_gif() {
  if(ledpanelOn) {
    if(playing_gif == 20) playing_gif = 0;
    else playing_gif++;
    current_media_type = "gif";
    current_media_id = playing_gif;
    activeStream = null;
    status = "playing";
    paused = false;
    client.publish('ledpanel/control', JSON.stringify({"command": "gif", "gif_number": playing_gif}));
    sendStatus();
    logging(`[INFO]: playing gif ${playing_gif}`);
  }
  else logging(`[WARNING] CANT SET NEXT GIF, LedPanel is OFF (ontime-schedule: ${on_time})`);
}

function play_gif(gif_number) {
  if(ledpanelOn) {
    current_media_type = "gif";
    current_media_id = playing_gif;
    activeStream = null;
    status = "playing";
    paused = false;
    client.publish('ledpanel/control', JSON.stringify({"command": "gif", "gif_number": gif_number}));
    playing_gif = gif_number;
    sendStatus();
    logging(`[INFO] playing gif ${gif_number}`);
  }
  else logging(`[WARNING] CANT SET GIF, LedPanel is OFF (ontime-schedule: ${on_time})`);
}

function set_media(media_name) {
  if(ledpanelOn) {
    let streamID = generateStreamID();    //veranderen (enkel goed voor enkel play_gif())
    current_media_type = "media";
    current_media_id = streamID;
    activeStream = streamID;
    status = "playing";
    paused = false;
    client.publish('ledpanel/control', JSON.stringify({"command": "stream", "stream": `stream_${streamID}`}));
    sendStatus();
    logging(`[INFO] playing media (${media_name})`);
  }
  else logging(`[WARNING] CANT SET MEDIA, LedPanel is OFF (ontime-schedule)`);
}

function set_effect(effect_name) {
  if(ledpanelOn) {
    let streamID = generateStreamID();    //veranderen (enkel goed voor enkel play_gif())
    current_media_type = "effect";
    current_media_id = streamID;
    activeStream = streamID;
    status = "playing";
    paused = false;
    client.publish('ledpanel/control', JSON.stringify({"command": "stream", "stream": `stream_${streamID}`}));
    sendStatus();
    logging(`[INFO] playing effect (${effect_name})`);
  }
  else logging(`[WARNING] CANT SET EFFECT, LedPanel is OFF (ontime-schedule: ${on_time})`);
}

var currentID = 0;
function generateStreamID() {
  function padLeft(nr, n, str){
    return Array(n-String(nr).length+1).join(str||'0')+nr;
  }
  if(currentID == 999) currentID = 0;
  currentID++;
  return padLeft(currentID,3);
}

function sendStatus() {
  let obj = JsonGenerator.statusToJson(
    status,
    paused,
    on_time,
    activeStream,
    current_media_type,
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