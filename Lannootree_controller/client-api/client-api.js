// npm install ws
import { WebSocketServer } from 'ws';


// add code here
const wss = new WebSocketServer({ port: 8080 });

wss.on('connection', ws => {
    console.log('connection to new client');
    
    ws.on("message", data => {
        if(data == "stop") {
            console.log("hallo " + data);
        }
    });


    ws.on("close", () => {
        console.log("client has disconnected")
    });
    
});

wss.on("connection", ws => {
    ws.send("stop");
});


// mqtt publish /AbortController