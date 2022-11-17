import { ref, type Ref } from 'vue';
import { defineStore } from 'pinia';
import type MqttStatus from '@/assets/frontendView/mqtt.status.interface';

export const useClientAPIStore = defineStore('client-api-store', () => {
  
  const color_matrix = ref({});

  const status_json: Ref<MqttStatus> = ref({
    matrix_size: {
      cols: 0,
      rows: 0
    },
    pause: false,
    status: "",
    fade: false,
    current_effect: "",
    effects: [],
    current_asset: "",
    assets: [],
    color: ""
  });

  const websocketactive = ref(false);
  const ws = new WebSocket(import.meta.env.VITE_FRONTEND_WEBSOCKET);

  const websocketClient = function () {
    ws.onopen = () => {
      console.log("we are connected to the client-API");
      websocketactive.value = true;
    };

    ws.onmessage = (event) => {
      
      let data = JSON.parse(event.data.toString());

      if(data.hasOwnProperty('matrix')) color_matrix.value = data.matrix;

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

  const setEffect = function (effect: string) {
    if(websocketactive.value == true) {
      console.log(status_json.value)
      console.log(status_json.value.current_effect)
      ws.send(JSON.stringify({"effect": effect}));
    };
  };

  const setAsset = function (selectedAsset: string) {
    if(websocketactive.value == true) {
      console.log(selectedAsset)
      ws.send(JSON.stringify({"asset": selectedAsset }));
    };
  };

  return {
    color_matrix,
    status_json,
    
    websocketClient,
    Pause,
    Stop,
    Color,
    setEffect,
    setAsset,
  };
});
