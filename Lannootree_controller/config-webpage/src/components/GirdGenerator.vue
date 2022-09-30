<script setup lang="ts">
import { notify } from '@kyvg/vue3-notification'
import { ref, computed } from 'vue';

class GridCell {
  public active: boolean;
  public coordinate: { col: number, row: number };

  constructor(a: boolean) {
    this.active = a;
    this.coordinate = { col: 0, row: 0 };
  }
};

const grid = ref([
  [new GridCell(false), new GridCell(false), new GridCell(false)],
  [new GridCell(false), new GridCell(true), new GridCell(false)],
  [new GridCell(false), new GridCell(false), new GridCell(false)],
]);

const colCount = computed(() => grid.value.length);
const rowCount = computed(() => grid.value[0].length);

const totalCells = computed(() => {
  return rowCount.value * colCount.value;
});

const boxSize = computed(() => {
  if (totalCells.value < 32) return '100px';
  if (totalCells.value < 128) return '50px';
  return '25px';
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

const jsonCofig = computed(() => {
  const config = {
    panelCount: grid.value.reduce((p, c) => { return p + c.reduce((pp, cc) => { return pp + (cc.active ? 1 : 0) }, 0) }, 0), // Lol
    cells: [].concat(...grid.value).filter(cell => cell.active) // Nice one liners javascript ;)
  };

  return JSON.stringify(config, null, 2);
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
  navigator.clipboard.writeText(jsonCofig.value);
  notify({
    title: "Copied to clipboard!"
  })
}

</script>

<template>
  <div class="wrapper">
    <notifications position="bottom right" />

    <div :style="gridStyle">
      <div v-for="i in totalCells" 
          :key="`cel${i}`" 
          :class="numberToCell(i).active ? 'selceted_grid_item' : 'unselected_grid_item'" 
          @click="addCell(i)"
          > 
      </div>
    </div>

    <div class="json_display" @click="copyToClipboard">
        <pre v-highlightjs>
          <code class="javascript" style="border-radius: 25px">{{ jsonCofig }}</code>
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

  .selceted_grid_item {
    width: 100%;
    height: 100%;

    background-color: white;
  }

  .unselected_grid_item {
    width: 100%;
    height: 100%;

    background-color: grey;

    cursor: pointer;
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

    cursor: copy;
    user-select: none;
  }
</style>
