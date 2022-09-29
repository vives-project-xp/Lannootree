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

        wss.on('connection', function connection(ws) {
            ws.on('message', function (message) {
                console.log('test');
            });
        });

        // wss.on('connection', function connection(ws) {
        //   ws.on('message', function message(data) {
        //     console.log('received: %s', data);
        //   });
        
        // wss.send('something'); 
    };
    

}