const ws = new WebSocket('ws://localhost:8080');

function websocketClient() {

  ws.onopen = (event) => {
    console.log(event)
    console.log("we are connected")
    ws.send("stop");

  }   
  
};

function stop() {
  ws.on = () => {
    ws.send("stop");
  }
};

function send(){
  ws.on = data => {
    ws.send(data);
  }

}


send();
stop();
websocketClient();

// sendMessage();

// ws.on("message", data => {
//   console.log('client has sent us: ' + data)
// })

// ws.onopen = function () {
//   ws.send("Hi, from the client."); // this works
//   alert("Connection opened...");
// };

// ws.onmessage = function (event) {
//       alert("Message received..." + event.data);
// };




function pause(){
  ws.send("pause")
}

function get_preprocessed(){

}

function play_preprocessed(){

}

function get_effect(){

}

function play_effect(){

}