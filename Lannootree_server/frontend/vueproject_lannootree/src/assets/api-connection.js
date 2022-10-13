const ws = new WebSocket('wss://lannootree.devbitapp.be/wss');

var websocketactive = false; 
export default function websocketClient() {

  ws.onopen = (event) => {
    console.log(event)
    console.log("we are connected to mqtt")
    websocketactive = true
  }   
};
websocketClient();


export function Pause(notPaused) {
  if(websocketactive == true) {

    ws.send(JSON.stringify({"pause": notPaused}));
    console.log(notPaused);

  }
};

export function Stop() {
  if(websocketactive == true) {
    
    ws.send(JSON.stringify({"stop": true}));
    console.log("stop!")

  }
  
};



export function Color(selectedColor) {
  if(websocketactive == true) {
    
    console.log(selectedColor);
    ws.send(JSON.stringify({"Color": selectedColor}));

  }
  
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