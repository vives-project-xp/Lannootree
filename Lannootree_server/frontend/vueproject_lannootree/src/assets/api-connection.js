<<<<<<< HEAD
=======
// const ws = new WebSocket('ws://localhost:3001');
>>>>>>> 5cdb07fdc903f69e3549c642e9684c0c0d2f5d53
const ws = new WebSocket('wss://lannootree.devbitapp.be/wss');

export default function websocketClient() {

  ws.onopen = (event) => {
    console.log(event)
    console.log("we are connected to mqtt")
    // ws.send("Hello from from client.");
  }   
};
websocketClient();


export function Pause(notPaused) {
  ws.send(JSON.stringify({"pause": notPaused}));
  console.log(notPaused);
};

export function Stop() {
  ws.onopen = () => ws.send(JSON.stringify({"stop": true}));
  console.log("stop!")
};

Stop();
export function Color() {
 
};

export function Effects(selectedEffect) {
  ws.onopen = () => ws.send("{stop: " + selectedEffect + "}");

 
};

// document.getElementById("test") = onOff();


// export function send(){
//   ws.on = data => {
//     ws.send(data);
//   }

// }

// send();
// Stop();

// sendMessage();

// ws.on("message", data => {
//   console.log('client has sent us: ' + data)
// })


// function pause(){
//   ws.send("pause")
// }

// function get_preprocessed(){

// }

// function play_preprocessed(){

// }

// function get_effect(){

// }

// function play_effect(){

// }