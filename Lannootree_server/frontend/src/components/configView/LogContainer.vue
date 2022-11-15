<script setup lang="ts">
  import { computed } from 'vue';
  import type { PropType } from 'vue';


  const props = defineProps({
    name: {
      type: String,
      required: true
    },
    
    modelValue: {
      type: Object as PropType<string[]>,
      required: true
    }
  });

  const msg = computed(() => {
    return props.modelValue
  });

</script>

<template>
  <v-card>
    <v-card-title>{{ props.name }}</v-card-title>

    <div style="height: 300px; overflow: scroll;">
      <v-list :items="msg"></v-list>    
    </div>
  </v-card>
</template>
