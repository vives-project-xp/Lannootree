<script setup lang="ts">
  import { useClientAPIStore } from '@/stores/client.connection';
  import {ref} from 'vue';
  
  const clientStore = useClientAPIStore();
  const current = ref('')

</script>
    
<template>
  <div class="d-flex align-center justify-center">
    
    <v-select
      v-model="current"
      label="Effect"
      :items="clientStore.status_json.effects"
      @update:modelValue="clientStore.setEffect(current)"
      density="comfortable"
      style="width: 150px; height: 50px;"
    ></v-select>
  </div>
</template>
