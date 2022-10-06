<script setup lang="ts">
import type { PropType } from 'vue';
import { GridCell } from '@/assets/GridCell';
import { ref, computed, defineProps } from 'vue'

const props = defineProps({
  cell: {
    type: Object as PropType<GridCell>,
    required: true
  },

  grid: {
    type: Object as PropType<GridCell[][]>,
    required: true
  }
});

const channels =[
  {
    name: 'Channel A0',
    shortName: 'CA0',
  }, {
    name: 'Channel A1',
    shortName: 'CA1',
  }, {
    name: 'Channel B0',
    shortName: 'CB0',
  }, {
    name: 'Channel B1',
    shortName: 'CB1',
  },
];

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
    // TODO: make colors more pretty i'm not a visual designer xp
    if (props.cell.channel === 'CA0') cellStylez['background-color'] = 'red';
    if (props.cell.channel === 'CA1') cellStylez['background-color'] = 'green';
    if (props.cell.channel === 'CB0') cellStylez['background-color'] = 'blue';
    if (props.cell.channel === 'CB1') cellStylez['background-color'] = 'yellow';
  }

  return cellStylez;
});

const connectables = computed(() => {
  let filtered: Array<GridCell> = ([] as Array<GridCell>).concat(...props.grid)
  .filter((cell: GridCell) => cell.channel === props.cell.channel)
  .filter((cell: GridCell) => cell.connection === null);

  let connectables: { direction: string, next: GridCell }[] = [];
  filtered.forEach((cell: GridCell) => {
    if (cell.coordinate.col == props.cell.coordinate.col - 1 && cell.coordinate.row == props.cell.coordinate.row) connectables.push({ direction: 'left', next: cell });
    if (cell.coordinate.col == props.cell.coordinate.col + 1 && cell.coordinate.row == props.cell.coordinate.row) connectables.push({ direction: 'right', next: cell });
    if (cell.coordinate.row == props.cell.coordinate.row - 1 && cell.coordinate.col == props.cell.coordinate.col) connectables.push({ direction: 'up', next: cell });
    if (cell.coordinate.row == props.cell.coordinate.row + 1 && cell.coordinate.col == props.cell.coordinate.col) connectables.push({ direction: 'down', next: cell });
  });
  
  return connectables;
});

const channelHasHead = computed(() => {
  return ([] as GridCell[]).concat(...props.grid)
          .filter(cell => cell.channel === props.cell.channel)
          .reduce((p, c) => p || c.isHead, false);
});

const setHead = function () {
  props.cell.isHead = true;
  props.cell.canConnect = true;
}

const addConnection = function (next: GridCell) {
  props.cell.connection = next;
  props.cell.canConnect = false;
  next.canConnect = true;
}

const changeChannel = function(channel: string) {
  let current: GridCell | undefined = ([] as GridCell[]).concat(...props.grid).find(cell => (cell.channel === props.cell.channel && cell.isHead));
  let next: GridCell | null = props.cell.connection;
  if (current !== undefined) {
    while (next) {
      current.canConnect = false;
      current.isHead = false;
      current.connection = null;
      current = next;
      next = next.connection;
    }
  }

  props.cell.channel = channel;
}
</script>

<template>
  <div :style="cellStyle">
    <div v-if="props.cell.active" class="dropdown">
      <button class="btn btn-secondary dropdown-toggle button" 
              type="button" 
              id="dropdownMenuButton" 
              data-bs-toggle="dropdown" 
              aria-expanded="false" 
              :style="cellStyle">
        <font-awesome-icon icon="fa-regular fa-list-alt"/>
      </button>

      <ul class="dropdown-menu dropdown-menu-dark" aria-labelledby="dropdownMenuButton">
        <!--* Channel submenu *-->
        <li>
          <a class="dropdown-item" href="#">Channel &raquo;</a>

          <ul class="dropdown-menu dropdown-menu-dark dropdown-submenu">
            <li v-for="chan in channels" :key="chan.shortName">
              <a class="dropdown-item" href="#" @click="changeChannel(chan.shortName)">
                {{ chan.name }}
              </a>
            </li>
          </ul>
        </li>

        <!--* Connection submenu *-->
        <li v-if="props.cell.channel !== null && props.cell.connection === null">
          <a class="dropdown-item" href="#" v-if="!channelHasHead" @click="setHead">
            Use as head
          </a>
          <a class="dropdown-item" href="#" v-if="props.cell.canConnect && connectables.length > 0">
            Add connection &raquo;
          </a>

          <ul class="dropdown-menu dropdown-menu-dark dropdown-submenu" v-if="channelHasHead && props.cell.canConnect">
            <li v-for="c in connectables" :key="`con${c.next.uuid}`" @click="addConnection(c.next)">
              <a class="dropdown-item" href="#">
                {{ c.direction }}
              </a>
            </li>
          </ul>
        </li>
      </ul>
    </div>
  </div>
  
</template>

<style scoped>
  .dropdown-toggle::after {
    display: none;
  }

  .button {
    border: none;
    color: black;
  }

  .dropdown-menu li {
    position: relative;
  }

  .dropdown-menu .dropdown-submenu {
    display: none;
    position: absolute;
    left: 100%;
    top: -7px;
  }

  .dropdown-menu .dropdown-submenu-left {
    right: 100%;
    left: auto;
  }

  .dropdown-menu > li:hover > .dropdown-submenu {
    display: block;
  }
</style>
