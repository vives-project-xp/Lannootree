import { ref } from 'vue';
import { defineStore } from "pinia";

export const useContainerLogging = defineStore('container-logging', () => {

  const containers = ref(new Map<string, string[]>());

  containers.value.set("docker-backend", ["Hello", "log"]);
  containers.value.set("docker-led-driver", ["Hello", "log"]);

  for (let i = 0; i < 100; i++) {
    containers.value.get("docker-led-driver")?.push(`This is a log message ${i}`)
  }

  const ws = new WebSocket(import.meta.env.VITE_LOGGING_WEBSOCKET);

  ws.onopen = () => {
    console.log("Connected to logging websocket");
  }

  ws.onmessage = (event: any) => {
    let data = JSON.parse(event.data.toString());

    if (!containers.value.has(data.container)) {
      containers.value.set(data.container, []);
    } else {
      let containerLog = containers.value.get(data.container);

      if (containerLog !== undefined) containerLog.push(data.msg);
    }
  }

  return {
    containers
  }

});
