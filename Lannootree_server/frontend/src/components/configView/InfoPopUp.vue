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
    width="150px"
  >
    <v-row>
      <v-col>
        <p
          class="ma-3"
        >
          {{ popup.description }}
        </p>
      </v-col>
    </v-row>

    <v-row>
      <v-col
        class="d-flex align-center justify-center ma-3"
      >
        <v-btn
          v-if='popup.buttonText !== ""'
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
