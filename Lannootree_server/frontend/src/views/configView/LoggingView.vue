<script setup lang="ts">
  import { ref } from 'vue';
  import { storeToRefs } from 'pinia';
  import { useContainerLogging } from '@/stores/container.logging'
  import LogContainer from '@/components/configView/LogContainer.vue';

  const loggingContainers = useContainerLogging();

  const { containers, statusContainers } = storeToRefs(loggingContainers);

  const items = ref([]);

  const chipColor = function (status: string) {
    if (status === "Online") return 'green';
    if (status === "Offline") return 'red';
    if (status === "Starting") return 'orange';
    if (status === "Sleep") return 'yellow';
  }

</script>

<template>
  <div>
    <v-row
      class="d-flex align-center justify-center"
    >
      <v-chip
        v-for="container in statusContainers"
        :key="`chip_${container.name}`"
        :color="chipColor(container.status)"
        class="ma-3"
      >
        {{ container.name }}
      </v-chip>
    </v-row>
  
    <v-spacer></v-spacer>

    <v-row justify="space-around">
      <LogContainer
        v-for="container in containers"
        :key="`con_${container.name}`"
        :name="container.name"
        v-model="container.msg"
        class="ma-5"
      />
    </v-row>
  </div>
</template>

<style scoped>

</style>
