<script setup lang="ts">
import { ref, computed, defineProps } from 'vue'
import GridCell from '@/assets/GridCell';

const props = defineProps({
  cell: {
    type: GridCell,
    required: true
  }
});

const cellStyle = computed(() => {
  let cellStylez = {
    width: '100%',
    height: '100%',
    color: 'balck',
    display: 'grid',
    'place-items': 'center',
    'background-color': props.cell.active ? 'white' : 'grey',
  }
  
  if (props.cell.active) {
    // TODO: make colors more pretty i'm not a visual desinger xp
    if (props.cell.channel === 'CA0') cellStylez['background-color'] = 'red';
    if (props.cell.channel === 'CA1') cellStylez['background-color'] = 'green';
    if (props.cell.channel === 'CB0') cellStylez['background-color'] = 'blue';
    if (props.cell.channel === 'CB1') cellStylez['background-color'] = 'yellow';
  }

  return cellStylez;
});

</script>

<template>
  <!-- TODO: Make just the div clickable to get dropdown menu so you don't need a button and won't look bad when cell get smaller -->
  <div :style="cellStyle">
    <div v-if="props.cell.active" class="dropdown" v-auto-animate>
      <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
        <font-awesome-icon icon="fa-regular fa-list-alt"/>
      </button>
      <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1">
        <li> 
          <a class="dropdown-item" href="#" @click="props.cell.channel = 'CA0'">
            Channel_A_0
          </a>
        </li>
        <li>
          <a class="dropdown-item" href="#" @click="props.cell.channel = 'CA1'">
            Channel_A_1
          </a>
        </li>
        <li>
          <a class="dropdown-item" href="#" @click="props.cell.channel = 'CB0'">
            Channel_B_0
          </a>
        </li>
        <li>
          <a class="dropdown-item" href="#" @click="props.cell.channel = 'CB1'">
            Channel_B_1
          </a>
        </li>
      </ul>
    </div>
  </div>

</template>

<style scoped>
  .dropdown-toggle::after {
    display: none;
  }
</style>
