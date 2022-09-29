<script setup lang="ts">
import { ref, computed } from 'vue';

class GridCell {
  public id: number;
  public active: boolean;

  constructor(a: boolean) {
    this.id = 0;
    this.active = a;
  }
};

const grid = ref([
  [new GridCell(false), new GridCell(false), new GridCell(false)], // Col0
  [new GridCell(false), new GridCell(true), new GridCell(false)], // Col1
  [new GridCell(false), new GridCell(false), new GridCell(false)], // Col2
]);

const colCount = computed(() => grid.value.length);
const rowCount = computed(() => grid.value[0].length);

const totalCells = computed(() => {
  return rowCount.value * colCount.value;
});

const gridStyle = computed(() => {
  return {
    'display' : 'grid',
    'grid-template-rows' : `repeat(${rowCount.value}, 100px)`,
    'grid-template-columns' : `repeat(${colCount.value}, 100px)`,
    'grid-gap' : '2px',
  };
});

const jsonCofig = computed(() => {
  let config = {
    panelCount: totalCells.value,
    grid: grid.value,
  };

  return JSON.stringify(config, null, 2);
});

const numberToCell = function(n: number) {  
  let row = Math.floor((n - 1) / colCount.value);
  let col = n - (row * colCount.value) - 1;
  
  grid.value[col][row].id = n;

  return {
    cell: grid.value[col][row],
    coordinate: {
      row: row,
      col: col,
    },
  }
};

const addCell = function(n: number) {
  let cell = numberToCell(n);
  cell.cell.active = true;

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
</script>

<template>
  <div>
    <div :style="gridStyle">
      <div v-for="i in totalCells" 
          :key="`cel${i}`" 
          :class="numberToCell(i).cell.active ? 'selceted_grid_item' : 'unselected_grid_item'" 
          @click="addCell(i)"
          > 
  
      </div>
    </div>

    <div class="json_display">
      <pre id="json">{{ jsonCofig }}</pre>
    </div>
  </div>
</template>

<style scoped>
  .selceted_grid_item {
    width: 100%;
    height: 100%;

    background-color: white;
  }

  .unselected_grid_item {
    width: 100%;
    height: 100%;

    background-color: grey;
  }

  .json_display {
    display: grid;
    overflow: scroll;

    height: 250px;
  }
</style>
