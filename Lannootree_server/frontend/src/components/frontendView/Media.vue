<script setup lang="ts">
  import { useClientAPIStore } from '@/stores/client.connection';
  import {ref} from 'vue';
  
  const clientStore = useClientAPIStore();
  const current = ref('')
</script>
    
<template>
    <v-row
      class="d-flex align-center justify-center"
    >
      <v-chip
        v-for="label in clientStore.status_json.media"
        :key="`chip_${label.name}`"
        class="ma-3"
      >
        {{ label.name }}
      </v-chip>
    </v-row>
</template>
