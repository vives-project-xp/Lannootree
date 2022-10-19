import { ref } from 'vue';
import { defineStore } from 'pinia';

export const useClientAPIStore = defineStore('client-api-store', () => {
  
  const color_matrix = ref({});
  const websocketactive = ref(false);
  const ws = new WebSocket(import.meta.env.VITE_FRONTEND_WEBSOCKET);

  const websocketClient = function () {
    ws.onopen = () => {
      console.log("we are connected to the client-API");
      websocketactive.value = true;
    };

    ws.onmessage = (event) => {
      let temp = JSON.parse(event.data.toString()).matrix;
      color_matrix.value = temp;
    };
  }

  websocketClient();

  const Pause = function(notPaused) {
    if(websocketactive.value == true) {
  
      ws.send(JSON.stringify({"pause": notPaused}));
      console.log(notPaused);
  
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

  const Effects = function (selectedEffect) {
    ws.onopen = () => ws.send("{stop: " + selectedEffect + "}");
  };

  return {
    color_matrix,

    websocketClient,
    Pause,
    Stop,
    Color,
    Effects,
  };
});
