<script setup lang="ts">
import CellGrid from './CellGrid.vue';
import { notify } from '@kyvg/vue3-notification'
import type JsonConfig from '@/assets/JsonConfig'
import { GridCell, type Grid } from '@/assets/GridCell'
import { ref, computed, type Ref, type ComputedRef } from 'vue'

const LED_PER_PANEL = 72;

const grid: Ref<Grid> = ref([
  [new GridCell(false) , new GridCell(false), new GridCell(false)],
  [new GridCell(false), new GridCell(true), new GridCell(false)],
  [new GridCell(false), new GridCell(false), new GridCell(false)],
]);

const currentConnectCell: Ref<GridCell | null> = ref(null);

const colCount = computed(() => grid.value.length);
const rowCount = computed(() => grid.value[0].length);

const totalCells = computed(() => {
  return rowCount.value * colCount.value;
});

// Loop over all cells an check if all active cells have been assigned a channel
const validConfig = computed(() => grid.value.reduce((p, c) => p && c.reduce((pp, cc) => pp && (cc.active ? cc.channel !== null : true), true), true));
const panelCount = computed(() => grid.value.reduce((p: number, c: GridCell[]) => { return p + c.reduce((pp: number, cc: GridCell) => { return pp + (cc.active ? 1 : 0) }, 0) }, 0));

const boxSize = computed(() => {
  if (totalCells.value < 32) return '100px';
  return '50px';
});

const gridStyle = computed(() => {
  return {
    'display' : 'grid',
    'grid-template-rows' : `repeat(${rowCount.value}, ${boxSize.value})`,
    'grid-template-columns' : `repeat(${colCount.value}, ${boxSize.value})`,
    'grid-gap' : '2px',
    'grid-area' : 'box',
  };
});

const jsonConfig: ComputedRef<JsonConfig> = computed(() => {
  let config: JsonConfig = {
    panelCount: panelCount.value,
    totalLeds: 0,
    inUseChannels: [],
    channels: {}
  };

  config.totalLeds = config.panelCount * 72;

  ([] as GridCell[]).concat(...grid.value) // Get all cells in one array
  .filter(cell => cell.active)  // Filter out inactive ones
  .forEach((cell: GridCell) => {
    if (cell.channel === null) return;

    if (config.channels[cell.channel] === undefined) { // Create channel object key if there is none
      config.channels[cell.channel] = {
        ledCount: LED_PER_PANEL,
        head: null,
        cells: [cell]
      }
    } else {
      config.channels[cell.channel].ledCount += LED_PER_PANEL;
      config.channels[cell.channel].cells.push(cell);
    }

    if (cell.isHead) {
      config.channels[cell.channel].head = cell.uuid;
    }
  });

  config.inUseChannels = Object.keys(config.channels);

  let other = (JSON.parse(JSON.stringify(config)) as JsonConfig); // Deep copy of config obj
  other.inUseChannels.forEach(key => {
    other.channels[key].cells.forEach((cell: GridCell) => {
      // Delete keys not needed for firmware an change connection to string
      delete cell.isHead;
      delete cell.canConnect;
      cell.connection = (cell.connection as GridCell).uuid;
    })
  });

  return other;
});

const numberToCell = function(n: number) {  
  let row = Math.floor((n - 1) / colCount.value);
  let col = n - (row * colCount.value) - 1;
  
  grid.value[col][row].coordinate.col = col;
  grid.value[col][row].coordinate.row = row;

  return grid.value[col][row];
};

const addCell = function(n: number) {
  let cell = numberToCell(n);
  cell.active = true;

  if (cell.coordinate.col == 0) {
    let newCol = [];
    for (let i = 0; i < rowCount.value; i++) newCol.push(new GridCell(false));
    grid.value.unshift(newCol);
  }

  if (cell.coordinate.row == 0) {
    grid.value.forEach(row => row.unshift(new GridCell(false)));
  }

  if (cell.coordinate.row == rowCount.value - 1) {
    grid.value.forEach(row => row.push(new GridCell(false)));
  }

  if (cell.coordinate.col == colCount.value - 1) {
    let newCol = [];
    for (let i = 0; i < rowCount.value; i++) newCol.push(new GridCell(false));
    grid.value.push(newCol);
  }
};

const copyToClipboard = function() {  
  if (validConfig.value) {
    navigator.clipboard.writeText(JSON.stringify(jsonConfig.value, null, 2));
    notify({
      title: "Copied to clipboard!"
    });
  }
}

const createConnection = function(ecell: GridCell) {
  ([] as GridCell[]).concat(...grid.value)
  .forEach(cell => {
    // Disable the buttons
    cell.diabled = true;
    currentConnectCell.value = ecell;
    
    if (cell.channel === ecell.channel) {
      // Highlight
      cell.canConnect = true;
    }
  });
}

const addConnection = function(i: number) {
  let cell = numberToCell(i);
  if (cell.channel !== currentConnectCell.value?.channel || currentConnectCell.value === null) return;

  currentConnectCell.value.connection = cell;

  // Redo all changes
}
</script>

<template>
  <div class="wrapper">
    <notifications position="bottom right" />

    <div :style="gridStyle">
      <CellGrid 
        v-for="i in totalCells" 
        :key="`cel${i}`" 
        :cell="numberToCell(i)"
        :grid="grid"
        @click="numberToCell(i).diabled ? addConnection(i) : addCell(i)"
        @create-connection="createConnection"
        />
    </div>

    <!-- ? Make this an other component maby ? -->
    <div class="json_display" @click="copyToClipboard" :style="validConfig ? { cursor: 'copy' } : { cursor: 'not-allowed' }">
        <pre v-highlightjs v-auto-animate>
          <code class="javascript" style="border-radius: 25px">{{ JSON.stringify(jsonConfig, null, 2) }}</code>
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
