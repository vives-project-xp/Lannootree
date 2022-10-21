import EventEmitter from 'events';
export default class DevCheck extends EventEmitter{
   
    production_server;
    previous_status = "Offline";
    developement_time = 10;
    online = true;
    controllerStatus = "Online";

    constructor(production_server, developement_time) {
        super();
        this.production_server = production_server;
        this.developement_time = developement_time;
    }

    Update(status) {
        status = status.toString();
        if (this.production_server && status != this.previous_status) {
            console.log(status);
            console.log(this.previous_status);

            this.previous_status = status;
            if (status == "Offline" && this.controllerStatus != "Online") {
                this.emit("timer");
                this.timeout_id = setTimeout(() => {this.Timer_finished()}, (1000 * this.developement_time));
                this.controllerStatus = "Online"
            }
            else if(status == "Online") {
                clearTimeout(this.timeout_id);
                this.emit("sleep");
                this.online = false;
                this.starting = false;
                this.controllerStatus = "Offline";
            }
        }
    }

    Timer_finished() {
        this.emit("startup");
        this.online = true;
    }
    
    Start() {
        this.emit("startup");
    }

    Online() {
        return this.online;
    }

}



// "use strict";
// const EventEmitter = require('events');

// class Client extends EventEmitter{

//     constructor(token, client_id, client_secret, redirect_uri, code){
//         super();
//         this.token = token;
//         this.client_id = client_id;
//         this.client_secret = client_secret;
//         this.redirect_uri = redirect_uri;
//         this.code = code;
//     }

//     eventTest(){
//         this.emit("event");
//         console.log(this.token);
//     }
// }

// let testClient = new Client(1,2,3,4,5);

// testClient.eventTest();
// testClient.on('event', () => {console.log('triggerd!')} );