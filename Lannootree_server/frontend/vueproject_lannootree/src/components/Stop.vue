<script>
  import { useClientAPIStore } from '../stores/client.connection';
  // Replaced by useClientStore
  // import { Stop } from '@/assets/api-connection.js';

export default {
  data() {
    return {
      clientStore: useClientAPIStore(),
    }
  }
}
</script>

<template>
	<button @click="clientStore.Stop">Stop</button>
</template>