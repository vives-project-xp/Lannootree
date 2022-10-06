import Color from './color.js';
import mqtt from "mqtt"

// MQTT
const client = mqtt.connect('mqtt://vps.arnoschoutteten.be');

client.on('connect', function () {
    console.log("connected");
    client.publish('status/controller', 'Online');
    
    client.subscribe('controller/matrixsize');
    client.subscribe('controller/stop');
    client.subscribe('controller/pause');
    client.subscribe('controller/play');
    client.subscribe('controller/togglepause');
    client.subscribe('controller/setcolor');
    client.subscribe('controller/effect');
    client.subscribe('controller/asset');
    

    client.publish('controller/matrixsize', JSON.stringify({"rows": 5,"columns": 5}));  // DEBUGGING
})

client.on('message', function (topic, message) {
    if(topic=="controller/matrixsize") {
        set_matrixsize(JSON.parse(message.toString()).rows, JSON.parse(message.toString()).columns);
    }
    else if(topic=="controller/stop") stop();
    else if(topic=="controller/pause") pause();
    else if(topic=="controller/play") play();
    else if(topic=="controller/togglepause") togglepause();
    else if(topic=="controller/setcolor") {
        playing_effect = null;
        const json_obj = JSON.parse(message.toString());
        set_color_full(json_obj.red, json_obj.green, json_obj.blue);
        frame_to_ledcontroller();

    }
    else if(topic=="controller/effect") {
        const json_obj = JSON.parse(message.toString());
        playing_effect = json_obj.effect_id;
        play();
    }
    else if(topic=="controller/asset") console.log("ASSET");
    else console.log("Unknown topic")
})

// CONTROLLER

var ledmatrix = [];

function set_matrixsize(rows, columns) {
    pause();
    if(!isNaN(rows) && !isNaN(columns)) {
        ledmatrix = Array.from(Array(Math.abs(rows)), () => new Array(Math.abs(columns)));
        const offcolor = new Color(0,0,0);
        for(var i = 0; i < ledmatrix.length; i++) {
            for(var j = 0; j < ledmatrix[i].length; j++) {
                ledmatrix[i][j] = offcolor;
            }
        }
        console.log(`NEW MATRIX SIZE: \tROWS: ${Math.abs(rows)}, COLUMNS: ${Math.abs(columns)}`);
    }
    if(playing_effect != null) play();
}

var ispaused = true;
function pause() {
    ispaused = true;
}
function play() {
    ispaused = false;
}
function togglepause() {
    ispaused = !ispaused;
}

function frame_to_ledcontroller() {
    // ------------------------------------
    // CODE FRAME STUREN NAAR LEDCONTROLLER



    // ------------------------------------
    
    
    frame_to_console(); // DEBUGGING
}

function frame_to_console() { // DEBUGGING
    var frame_console = "";
    for(var i = 0; i < ledmatrix.length; i++) {
        for(var j = 0; j < ledmatrix[i].length; j++) {
            if(ledmatrix[i][j] instanceof Color) {
                var rgb = ledmatrix[i][j].get_color();
                frame_console+=`(${rgb[0]},${rgb[1]},${rgb[2]})` 
            }
        }
        frame_console+="\n";
    }
    console.log(frame_console);
}

function set_color_full(red, green, blue) {
    if(!isNaN(red) && !isNaN(green) && !isNaN(blue)) {
        if(red<=255 && green<=255 && blue<=255 && red>=0 && green>=0 && blue>=0) {
            for(var i = 0; i < ledmatrix.length; i++) {
                for(var j = 0; j < ledmatrix[i].length; j++) {
                    ledmatrix[i][j].set_color(red, green, blue);
                }
            }
        }
    }
}

var playing_effect = null;

var effect1_counter = 0;
var effect2_counter = 0;
var effect3_counter = 0;
var effect4_counter = 0;

function play_effect() {
    if(playing_effect == "effect1") {       //RANDOM KLEUREN (VOLLEDIG PANEEL)
        set_color_full(Math.floor(Math.random()*256), Math.floor(Math.random()*256), Math.floor(Math.random()*256));
        console.log("EFFECT1")
    }
    else if(playing_effect == "effect2") {  //RANDOM KLEUREN (IEDERE LED APART)
        for(var i = 0; i < ledmatrix.length; i++) {
            for(var j = 0; j < ledmatrix[i].length; j++) {
                ledmatrix[i][j].set_color(Math.floor(Math.random()*256),Math.floor(Math.random()*256),Math.floor(Math.random()*256));
            }
        }
        console.log("EFFECT2")
    }
    else {
        pause();
        playing_effect = null;
        set_color_full(100,0,0);
        frame_to_ledcontroller();
    }
}

function stop(){
    pause();
    playing_effect = null;
    set_color_full(0,0,0);
    frame_to_ledcontroller();
}

setInterval(() => {
    if(!ispaused) {
        if(playing_effect != null) {
            play_effect();
            frame_to_ledcontroller();
        }
    }
    else {
        console.log("PAUSED");
    }
}, 2000);