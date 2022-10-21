<script setup lang="ts">
  import { toRefs } from 'vue';
  import type { PropType } from 'vue'
  import { ref, computed, watch } from 'vue'
  import type { Panel, Coordinate } from '@/assets/Panel';
  import { usePanelGrid } from '@/stores/PanelGrid'

  const panelStore = usePanelGrid();

  const props = defineProps({
    coordinate: {
     type: Object as PropType<Coordinate>,
     required: true, 
    }
  });

  const p_panel = computed(() => {
    return panelStore.panels.getValue(props.coordinate.col, props.coordinate.row);
  });

  const panelStyle = computed(() => {
    let panelStylez = {
      width: '100%',
      height: '100%',
      color: 'balck',
      display: 'grid',
      'place-items': 'center',
      'background-color': p_panel.value !== null ? 'white' : 'grey',
    }
    
    console.log(p_panel.value);
    

    if (p_panel.value !== null && p_panel.value !== undefined) {
      // TODO: make colors more pretty i'm not a visual designer xp
      if (p_panel.value.channel === 'CA0') panelStylez['background-color'] = 'red';
      if (p_panel.value.channel === 'CA1') panelStylez['background-color'] = 'green';
      if (p_panel.value.channel === 'CB0') panelStylez['background-color'] = 'blue';
      if (p_panel.value.channel === 'CB1') panelStylez['background-color'] = 'yellow';
    }

    return panelStylez;
  }); 

  const hasPanel = computed(() => {
    return (p_panel.value !== null && p_panel.value !== undefined) ? true : false;
  });

</script>

<template>
  <v-sheet :style="panelStyle" :class="p_panel === null ? 'cell' : ''" @click="!hasPanel ? panelStore.addPanel(props.coordinate) : ''">
    <v-menu transition="scale-transform" v-if="p_panel !== null">

      <template v-slot:activator="{ props }">
        <v-btn
          color="grey-darken-2"
          v-bind="props"
          icon="mdi-cog"
          size="small"
          >
        </v-btn>
      </template>

      <v-list>
        <v-list-item
          v-for="chan in panelStore.channels"
          :key="chan.shortName"
          @click="panelStore.changeChannel(props.coordinate, chan.shortName)"
        >
          {{ chan.name }}
        </v-list-item>
      </v-list>

    </v-menu>
  </v-sheet>
</template>

<style scoped>
  .cell:hover {
    transform: scale(0.90, 0.90);
  }

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
