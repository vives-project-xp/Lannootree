<script setup lang="ts">
  import { computed } from 'vue';
  import { usePanelGrid } from '@/stores/PanelGrid';
  import Panel from '@/components/configView/Panel.vue'

  const panelStore = usePanelGrid();

  const boxSize = computed(() => {
    if (panelStore.totalPanels < 64) return '100px';
    return '50px';
  });

</script>

<template>
  <table
    :style="{ border: 'none', 'border-collapse': 'collapse' }"
  >
    <tr v-for="row in panelStore.panels.dimention()[1]" 
      :key="`row${row}`"
    >
      <td v-for="col in panelStore.panels.dimention()[0]" 
        :style="{ width: boxSize, height: boxSize, padding: '2px' }"
        :key="`col${col}${row}`" 
      >
        <Panel :coordinate="{ col: col - 1, row: row - 1 }"/>
      </td>
    </tr>
  </table>
</template>
