<script setup lang="ts">
import { ref, computed } from 'vue'
import { useMouseInElement } from '@vueuse/core'

const target = ref(null);

const { elementX, elementY, isOutside, elementHeight, elementWidth } =
  useMouseInElement(target);

const cardTransform = computed(() => {
  const MAX_ROTATION = 6;

  const rX = (
    MAX_ROTATION / 2 -
    (elementY.value / elementHeight.value) * MAX_ROTATION
  ).toFixed(2);

  const rY = (
    (elementX.value / elementWidth.value) * MAX_ROTATION -
    MAX_ROTATION / 2 
  ).toFixed(2);

  return isOutside.value 
  ? '' 
  : `rotateX(${rX}deg) rotateY(${rY}deg)`;
});

</script>

<template>
  <div class="transform" ref="target" style="{ width: 150px; height: 150px }">
    I rotate in 3d
  </div>
</template>

<style scoped>
.transform {
  transform: v-bind(cardTransform);
  transition: transform 0.25s ease-out;
  perspective: v-bind(elementWidth * 5);
  transform-style: preserve-3d;
  width: 150px;
  height: 150px;
  background-color: white;
}
</style>
