<script setup lang="ts">
  import { useClientAPIStore } from '@/stores/client.connection';
  
  const clientStore = useClientAPIStore();

</script>

<template>
	<v-btn @click="clientStore.Stop">Stop</v-btn>
</template>