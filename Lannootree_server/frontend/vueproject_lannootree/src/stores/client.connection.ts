import { ref } from 'vue';
import { defineStore } from 'pinia';

export const useClientAPIStore = defineStore('client-api-store', () => {
  
  const color_matrix = ref({});
  const status_json = ref({});

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

  const Pause = function(paused) {
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

  function Color(selectedColor) {
    if(websocketactive.value == true) {
      
      // console.log(selectedColor);
      ws.send(JSON.stringify({"Color": selectedColor}));
  
    }
  };

  const setEffect = function (selectedEffect) {
    if(websocketactive.value == true) {
      console.log(selectedEffect)
      ws.send(JSON.stringify({"effect": selectedEffect }));
    };
  };

  const setAsset = function (selectedAsset) {
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
