<script setup lang="ts">
  import { useClientAPIStore } from '@/stores/client.connection';
  
  const clientStore = useClientAPIStore();

</script>
    
<template>
  <div class="d-flex align-center justify-center">
    <v-select
      :items="clientStore.status_json.effects"
      label="Effect"
      density="comfortable"
      style="width: 150px; height: 50px;"
    ></v-select>
  </div>
</template>
    