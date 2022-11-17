<script setup lang="ts">
  import { useClientAPIStore } from '@/stores/client.connection';
  
  const clientStore = useClientAPIStore();

</script>
    
<template>
  <div class="d-flex align-center justify-center">
    <v-select
      label="Effect"
      :items="clientStore.status_json.effects"
      @update:modelValue="clientStore.setEffect"
      density="comfortable"
      style="width: 150px; height: 50px;"
    ></v-select>
  </div>
</template>
    