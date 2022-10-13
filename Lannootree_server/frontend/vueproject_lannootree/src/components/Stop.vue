<script>
import { Stop } from '@/assets/api-connection.js';
export default {
  data() {
    return {
    }
  },
  methods: {
    stop() {
      console.log("stop")
      // <Stop />
    }
  }
}
</script>

<template>
	<button @click="stop">Stop</button>
</template>