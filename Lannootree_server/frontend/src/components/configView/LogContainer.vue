<script setup lang="ts">
  import type { PropType } from 'vue';

  const props = defineProps({
    name: {
      type: String,
      required: true
    },
    msg: {
      type: Object as PropType<Array<String>>,
      required: true
    }
  });

</script>

<template>
  <v-card>
    <v-card-title>{{ props.name }}</v-card-title>

    <div style="height: 300px; overflow: scroll;">
      <v-list :items="props.msg"></v-list>    
    </div>
  </v-card>
</template>
