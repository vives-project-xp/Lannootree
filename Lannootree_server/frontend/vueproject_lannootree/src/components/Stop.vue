<script>
  import { useClientAPIStore } from '../stores/client.connection';
  // Replaced by useClientStore
  // import { Stop } from '@/assets/api-connection.js';

export default {
  data() {
    return {
      clientStore: useClientAPIStore(),
    }
  },
  methods: {
    stop() {
      // console.log("stop")
      // <Stop/>
    }
  }
}
</script>

<template>
	<button @click="clientStore.Stop">Stop</button>
</template>