<script setup lang="ts">
  import { ref } from 'vue'
  import { useClientAPIStore } from '@/stores/client.connection'
  
  const clientStore = useClientAPIStore();
  // const current = ref()

</script>

<template>
  <v-btn
    :icon="clientStore.status_json.pause ? 'mdi-pause' : 'mdi-play'"
    :color="clientStore.status_json.pause ? 'red' : 'green'"
    @click="clientStore.status_json.pause ? clientStore.Pause(false) : clientStore.Pause(true)"    
  />
</template>

