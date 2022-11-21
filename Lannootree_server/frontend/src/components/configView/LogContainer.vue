<script setup lang="ts">
  import { computed, ref, watch, nextTick, toRefs } from 'vue';
  import type { PropType } from 'vue'

  const logs = ref<HTMLDivElement | null>(null);

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
    return props.modelValue as string[]
  });

  const scrollToBottom = function () {
    console.log("scroll")
    if (logs.value) 
      logs.value.scrollTop = logs.value.scrollHeight;
  }

  const messages = toRefs(props).modelValue;

  watch(messages, async () => {
    await nextTick();
    if (logs.value)
      logs.value.scrollTop = logs.value.scrollHeight;
  }, { deep: true });

</script>

<template>
  <v-card
    width="1000px"
    max-height="400px"
  >
    <v-card-title
      class="d-flex justify-center align-center"
    >
      <h2>{{ props.name }}</h2>
    </v-card-title>

    <div 
      ref="logs" 
      @click="scrollToBottom"
      class="scrollable d-flex flex-column align-start pa-3" 
    >
      <pre v-for="(line, i) in msg" :key="`log${i}`" class="ml-5">{{ line }}</pre>
    </div>
  </v-card>
</template>

<style scoped>
  .scrollable {
    height: 350px; 
    overflow: scroll; 
    display: flex; 
    flex-direction: column-reverse;
  }
</style>
