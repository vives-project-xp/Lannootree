<script setup lang="ts">
  import { ref, computed } from 'vue'
  import Panel from '@/components/Panel.vue'
  import { notify } from '@kyvg/vue3-notification'
  import { usePanelGrid } from '@/stores/PanelGrid'
import Card from './Card.vue'

  const panelStore = usePanelGrid();

  const boxSize = computed(() => {
    if (panelStore.totalPanels < 32) return '100px';
    return '50px';
  });

  const rowStyle = computed(() => {
    return  {
      'display' : 'grid',
      'grid-template-rows' : `repeat(${panelStore.panels.dimention()[1]}, ${boxSize.value}`,
      'grid-gap' : '2px'
    };
  });

  const colStyle = computed(() => {
    return  {
      'display' : 'grid',
      'grid-template-columns' : `repeat(${panelStore.panels.dimention()[0]}, ${boxSize.value}`,
      'grid-gap' : '2px'
    };
  });

</script>

<template>
  <div class="wrapper">
    <notifications position="bottom right" />

    <div :style="rowStyle">
      <div v-for="row in panelStore.panels.dimention()[1]" :key="`row${row}`" :style="colStyle" :id="`row: ${row - 1}`">
        <div v-for="col in panelStore.panels.dimention()[0]" :key="`col${col}`" :id="`col: ${col - 1}`">
          <Panel :coordinate="{ col: col - 1, row: row - 1 }"/>
        </div>
      </div>
    </div>

    <!-- ? Make this an other component maby ? -->
    <!-- <div class="json_display" @click="copyToClipboard" :style="validConfig ? { cursor: 'copy' } : { cursor: 'not-allowed' }"> -->
    <div class="json_display">
        <pre v-highlightjs>
          <code class="javascript" style="border-radius: 25px">{{ panelStore.toJson }}</code>
        </pre>
    </div>
  </div>
</template>

<style scoped>
  .wrapper {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-areas: "box json";

    place-items: center; /* Just center nice and easy :) */
    
    height: 90vh;
  }

  .json_display {
    display: grid;
    grid-area: "json";
    
    height: 80%;
    width: 80%;
    margin: 10px;

    overflow: scroll;
    scrollbar-width: none;

    border-radius: 25px;

    user-select: none;
  }
</style>
