<script setup lang="ts">
  import { computed, ref } from 'vue';
  import type { PropType } from 'vue';
  import type { Popup } from '@/assets/ConfigView/Popup';


  const props = defineProps({
    modelValue: {
      type: Object as PropType<Popup>,
      required: true
    }
  });

  const emit = defineEmits(['update:modelValue', 'button-clicked']);

  const popup = computed({
    get: () => props.modelValue,
    set: (value) => emit('update:modelValue', value)
  });

</script>

<template>
  <v-card
    max-width="250px"
  >
    <v-row>
      <v-col>
        <div
          class="ma-3"
        >
          <span style="white-space: pre-line">
            {{ popup.description }}
        </span>
        </div>
      </v-col>
    </v-row>

    <v-row v-if='popup.buttonText !== ""'>
      <v-col
        class="d-flex align-center justify-center ma-3"
      >
        <v-btn
          @click="emit('button-clicked')"
        >
          {{ popup.buttonText }}
        </v-btn>
      </v-col>
    </v-row>

  </v-card>
</template>

<style scoped>
  .pop-up {
    z-index: 5;
  }
</style>
