<script setup lang="ts">
  import LogContainer from '@/components/configView/LogContainer.vue';
  import { useContainerLogging } from '@/stores/container.logging'

  const loggingContainers = useContainerLogging();

</script>

<template>
  <div>
    <LogContainer
      v-for="container in loggingContainers.containers"
      :key="`con_${container[0]}`"
      :name="container[0]"
      :msg="container[1]"
      class="ma-5"
    />
  </div>
</template>

<style scoped>

</style>
