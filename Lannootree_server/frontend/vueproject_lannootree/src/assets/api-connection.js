const ws = new WebSocket('wss://lannootree.devbitapp.be/wss');

export default function websocketClient() {

  ws.onopen = (event) => {
    console.log(event)
    console.log("we are connected to mqtt")
    // ws.send("Hi, from the client.");
    // ws.send("stop");

  }   
  
};


export function Pause(notPaused) {
  ws.send(notPaused);
  console.log(notPaused);
};

export function stop() {
  ws.send();
  console.log(notPaused);
};

export function Color() {
  ws.send("effect");
  console.log('test');
};

// document.getElementById("test") = onOff();


// export function send(){
//   ws.on = data => {
//     ws.send(data);
//   }

// }

// send();
// stop();
websocketClient();

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