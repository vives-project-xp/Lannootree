import Color from './color.js';
import mqtt from "mqtt"

// MQTT
const client = mqtt.connect('mqtt://vps.arnoschoutteten.be');

client.on('connect', function () {
    console.log("connected")
})

client.subscribe('controller/stop');
client.subscribe('controller/pause');
client.subscribe('controller/setcolor');
client.subscribe('controller/effect');
client.subscribe('controller/asset');

client.on('message', function (topic, message) {
    //console.log(topic)
    if(topic=="controller/stop") console.log("STOP");
    else if(topic=="controller/pause") console.log("PAUSE");
    else if(topic=="controller/setcolor") {
        console.log(message.toString());
        const json_obj = JSON.parse(message.toString());
        console.log(json_obj.red)
        console.log(json_obj.green)
        console.log(json_obj.blue)
    }
    else if(topic=="controller/effect") console.log("EFFECT");
    else if(topic=="controller/asset") console.log("ASSET");
    else console.log("Unknown topic")
    client.end()
})

// CONTROLLER

// var ispaused = false;
// var preprocessed= null;
// var effect = null;
// var ledmatrix = Array.from(Array(10), () => new Array(10));

// function main() {
//     if(!ispaused) {
//         if(preprocessed != null) play_preprocessed(preprocessed);
//         if(effect != null) play_effect(effect);
//         client.publish('controller/stop', "false");
    
        
    
//         // Debugging
//         // for(var i = 0; i < ledmatrix.length; i++) {
//         //     for(var j = 0; j < ledmatrix[i].length; j++) {
//         //         console.log(ledmatrix[i][j]);
//         //     }
//         // }
//     }
// }

// function set_matrixsize(width, height) {
//     stop()
//     ledmatrix = Array.from(Array(height), () => new Array(width));
// }

// function stop(){
//     effect=null;
//     preprocessed=null;
//     const off = new Color(0,0,0);
//     for(var i = 0; i < ledmatrix.length; i++) {
//         for(var j = 0; j < ledmatrix[i].length; j++) {
//             ledmatrix[i][j] = off;
//         }
//     }
// }

// function pause(){
//     ispaused = !ispaused;
// }

// function get_preprocessed(){

// }

// function set_preprocessed(preprocessed_id){
//     preprocessed = preprocessed_id
// }

// function play_preprocessed(){

// }

// function set_color(red, green, blue) {

// }

// function set_effect(effect_id){
//     effect = effect_id;
// }

// var index = 0;
// function play_effect(){
//     if(effect == "eff1") {


//     }

// }

// function get_client_json(){
//     return [ 
//         { eff_id: "eff_1", eff_name: ""},
//         { eff_id: "eff_2", eff_name: ""},
//         { eff_id: "eff_3", eff_name: ""}
//     ]
// }

// function updateMatrix() {
//     if(!ispaused) {
//         if(preprocessed != null) play_preprocessed(preprocessed);
//         if(effect != null) play_effect(effect);

//         client.publish('controller/stop', "false");
    
//         // Debugging
//         // for(var i = 0; i < ledmatrix.length; i++) {
//         //     for(var j = 0; j < ledmatrix[i].length; j++) {
//         //         console.log(ledmatrix[i][j]);
//         //     }
//         // }

//     }
// }

// setInterval(main, 1000);