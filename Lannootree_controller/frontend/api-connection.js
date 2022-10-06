function websocketClient() {

  // const WebSocket = require('ws')
  const ws = new WebSocket('ws://localhost:8080');


  ws.addEventListener("open", () => {
    console.log("we are connected")
    ws.send("hey, how you doing??");
  })

};

window.onload = function() {
  websocketClient();
};


function stop(){

}

function pause(){

}

function get_preprocessed(){

}

function play_preprocessed(){

}

function get_effect(){

}

function play_effect(){

}