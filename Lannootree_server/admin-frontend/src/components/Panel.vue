<script setup lang="ts">
  import { toRefs } from 'vue';
  import type { PropType } from 'vue'
  import { ref, computed, watch } from 'vue'
  import type { Panel } from '@/assets/Panel';
  import { usePanelGrid } from '@/stores/PanelGrid'

  const panelStore = usePanelGrid();

  const props = defineProps({
    p_panel: {
      type: Object as PropType<Panel>,
      required: true
    },
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

  const panelStyle = computed(() => {
    let panelStylez = {
      width: '100%',
      height: '100%',
      color: 'balck',
      display: 'grid',
      'place-items': 'center',
      'background-color': props.p_panel.active ? 'white' : 'grey',
    }
    
    if (props.p_panel.active) {
      // TODO: make colors more pretty i'm not a visual designer xp
      if (props.p_panel.channel === 'CA0') panelStylez['background-color'] = 'red';
      if (props.p_panel.channel === 'CA1') panelStylez['background-color'] = 'green';
      if (props.p_panel.channel === 'CB0') panelStylez['background-color'] = 'blue';
      if (props.p_panel.channel === 'CB1') panelStylez['background-color'] = 'yellow';
    }

    return panelStylez;
  }); 

</script>

<template>
  <div :style="panelStyle" :class="!p_panel.active ? 'cell' : ''" @click="panelStore.addPanel(props.p_panel)">
    <div v-if="props.p_panel.active" class="dropdown">
      <button class="btn btn-secondary dropdown-toggle button" 
              type="button" 
              id="dropdownMenuButton" 
              data-bs-toggle="dropdown" 
              aria-expanded="false" 
              :disabled="props.p_panel.disabled">
        <font-awesome-icon icon="fa-regular fa-list-alt"/>
      </button>

      <ul class="dropdown-menu dropdown-menu-dark" aria-labelledby="dropdownMenuButton" v-show="!props.p_panel.disabled">
        <!--* Channel submenu *-->
        <li>
          <a class="dropdown-item" href="#">Channel &raquo;</a>

          <ul class="dropdown-menu dropdown-menu-dark dropdown-submenu">
            <li v-for="chan in channels" :key="chan.shortName">
              <a class="dropdown-item" href="#" @click="panelStore.changeChannel(p_panel, chan.shortName)">
                {{ chan.name }}
              </a>
            </li>
          </ul>
        </li>

        <!--* Connection submenu *-->
        <li v-if="props.p_panel.channel !== null && props.p_panel.connection === null">
          <!-- <a class="dropdown-item" href="#" v-if="!channelHasHead" @click="setHead">
            Use as head
          </a> -->
          <!-- <a class="dropdown-item" href="#" v-if="props.cell.canConnect" @click="emit('createConnection', props.cell)">
            Add connection
          </a> -->
        </li>
      </ul>
    </div>
  </div>
  
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
