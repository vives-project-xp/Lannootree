function websocketClient() {

  const ws = new WebSocket('ws://localhost:8080/');

  ws.on('open', function open() {
    ws.send('something');
  });

  ws.on('message', function incoming(data) {
    console.log(data);
  });

  // ws.send("Here's some text that the server is urgently awaiting!")

}

onload(websocketClient());


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

