import { ref, type Ref } from 'vue';
import { defineStore } from "pinia";

export const useContainerLogging = defineStore('container-logging', () => {

  const containers: Ref<{ name: string, msg: string[] }[]> = ref([]);
  const statusContainers: Ref<{ name: string, status: string }[]> = ref([]);

  const ws = new WebSocket(import.meta.env.VITE_LOGGING_WEBSOCKET);

  ws.onopen = () => {
    console.log("Connected to logging websocket");
  }

  ws.onmessage = (event: any) => {
    let data = JSON.parse(event.data.toString());

    if (data.hasOwnProperty("log")) {
      let container_id = data.log.container;
      let container = containers.value.find((c) => c.name == container_id);
  
      if (container !== undefined) {
        container.msg.push(data.log.timestamp + " " + data.log.message);
      } else {
        containers.value.push({
          name: container_id,
          msg: [data.log.timestamp + " " + data.log.message],
        })
      }
    }

    if (data.hasOwnProperty("status")) {
      let container_id = data.status.container;
      let container = statusContainers.value.find((c) => c.name == container_id);

      if (container !== undefined) {
        container.status = data.status.status;
      } else {
        statusContainers.value.push({
          name: container_id,
          status: data.status.status
        });
      }
    }
  }

  return {
    containers,
    statusContainers,
    ws
  }

});
