import { ref, type Ref } from 'vue';
import { defineStore } from 'pinia';
import type MqttStatus from '@/assets/frontendView/mqtt.status.interface';

export const useClientAPIStore = defineStore('client-api-store', () => {
  

const status_json: Ref<MqttStatus> = ref({
  status: "",
  pause: false,
  ontime: "",
  active_stream: null,
  active: {
    type: "",
    media_id: 0
  },
  media: []
});
  

  const websocketactive = ref(false);
  const ws = new WebSocket(import.meta.env.VITE_FRONTEND_WEBSOCKET);


  const websocketClient = function () {
    ws.onopen = () => {
      console.log("[INFO] we are connected to the client-API");
      websocketactive.value = true;
    };

    ws.onmessage = (event) => {
      
      let data = JSON.parse(event.data.toString());
      // if(data.hasOwnProperty('matrix')) color_matrix.value = data.matrix;

      if(data.hasOwnProperty('status')){
        status_json.value = data;
        console.log(data);
      }    

         
    };
    // ws.onmessage = (event) => {
    //   let temp = JSON.parse(event.data.toString()).matrix;
  
      
  
    //   color_matrix.value = temp;
    // };
  }

  websocketClient();

  const Pause = function(paused: boolean) {
    if(websocketactive.value == true) {
      if(paused) {
        ws.send(JSON.stringify({"pause": true}));
        console.log(paused);
      }
      else{
        ws.send(JSON.stringify({"play": true}));
        console.log(paused);
      }
    }
   
  };

  const Stop = function () {
    if(websocketactive.value == true) {
  
      ws.send(JSON.stringify({"stop": true}));
      console.log("stop!")
  
    }
  };

  function Color(selectedColor: string) {
    if(websocketactive.value == true) {
      
      // console.log(selectedColor);
      ws.send(JSON.stringify({"Color": selectedColor}));
  
    }
  };

  const setMedia = function (media: Number) {
    if(websocketactive.value == true) {
      console.log(media)
      ws.send(JSON.stringify({"media": media}));
    };
  };

  return {
    status_json,
    
    websocketClient,
    Pause,
    Stop,
    Color,
    setMedia,
  };


});


