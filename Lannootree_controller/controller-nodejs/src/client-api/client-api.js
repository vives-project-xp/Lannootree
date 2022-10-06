// npm install ws
import { WebSocketServer } from 'ws';

export default class ClientAPI {
    // Node.js WebSocket server script
    
    constructor() {  
    }
     

    async _main() {
        // add code here
        console.log('hallo')   

        const wss = new WebSocketServer({ port: 8080 });

        wss.on('connection', ws => {
            console.log('connection to new client');
            
            ws.on("close", () => {
                console.log("client has disconnected")
            });

            
        });
        
        wss.on("message", data => {
            console.log('client has sent us: ' + data)
        })
        // wss.on('connection', function connection(ws) {
        //   ws.on('message', function message(data) {
        //     console.log('received: %s', data);
        //     });
        
        // wss.send('something'); 
        // });
    } 

}