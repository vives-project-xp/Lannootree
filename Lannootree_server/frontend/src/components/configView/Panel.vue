<script setup lang="ts">
  import { ref, computed, watch } from 'vue'
  import { useMouseInElement, onLongPress } from '@vueuse/core'
  
  import { usePanelGrid } from '@/stores/PanelGrid'
  import { useDisplayOptions } from '@/stores/DisplayOptions'
  
  import type { PropType } from 'vue'
  import type { Coordinate } from '@/assets/ConfigView/Panel'

  const panelStore = usePanelGrid();
  const display_options = useDisplayOptions();

  const props = defineProps({
    coordinate: {
     type: Object as PropType<Coordinate>,
     required: true, 
    }
  });

  const longPressed = ref(false);
  const target = ref<HTMLElement | null>(null);
  const { elementX, elementY, isOutside, elementHeight, elementWidth } = useMouseInElement(target);

  // Callback for longpress event
  const onLongPressCallbackHook = function (e: PointerEvent) {
    // Start connection phase
    if (!panelStore.connectionPhase) {
      longPressed.value = true;
      panelStore.connectionPhase = true;
      panelStore.connection.from = props.coordinate;
    }
  }

  // Add listener to panel and fire when mouse was down for 250ms
  onLongPress(
    target,
    onLongPressCallbackHook,
    { modifiers: { prevent: true }, delay: 250 }
  );

  // Return panel object reference based on coordinate
  const p_panel = computed(() => {
    return panelStore.panels.getValue(props.coordinate.col, props.coordinate.row);
  });

  // Just some styling
  const panelStyle = computed(() => {
    let panelStylez = {
      width: '100%',
      height: '100%',
      color: 'balck',
      display: 'grid',
      'place-items': 'center',
      'background-color': p_panel.value !== null ? 'white' : 'grey',
    }

    if (p_panel.value !== null && p_panel.value !== undefined) {
      // TODO: make colors more pretty i'm not a visual designer xp
      if (p_panel.value.channel === 'CA0') panelStylez['background-color'] = 'red';
      if (p_panel.value.channel === 'CA1') panelStylez['background-color'] = 'green';
      if (p_panel.value.channel === 'CB0') panelStylez['background-color'] = 'blue';
      if (p_panel.value.channel === 'CB1') panelStylez['background-color'] = 'yellow';
    }

    return panelStylez;
  }); 

  // Checks if panel is not null | undefined
  const hasPanel = computed(() => {
    return (p_panel.value !== null && p_panel.value !== undefined) ? true : false;
  });

  // Calculates transform for 3D effect
  const panelTransform = computed(() => {
    const MAX_ROTATION = 8;

    const rX = (
      MAX_ROTATION / 2 -
      (elementY.value / elementHeight.value) * MAX_ROTATION
    ).toFixed(2);

    const rY = (
      (elementX.value / elementWidth.value) * MAX_ROTATION -
      MAX_ROTATION / 2 
    ).toFixed(2);

    if (!display_options.options.effect_3d) return '';

    return isOutside.value 
    ? '' 
    : `perspective(${elementWidth.value}px) rotateX(${rX}deg) rotateY(${rY}deg)`;
  });

  // Just removes panel's channel form chanel list
  const channelFilter = computed(() => {
    if (panelStore.panels.getValue(props.coordinate.col, props.coordinate.row) === null) return [];
    let this_panel = panelStore.panels.getValue(props.coordinate.col, props.coordinate.row);
    let copy_channel: { name: string, shortName: string }[] = JSON.parse(JSON.stringify(panelStore.channels))
    
    copy_channel.splice(copy_channel.findIndex(c => c.shortName == this_panel?.channel), 1);
    
    return copy_channel;
  })

  // Click event on the panel
  const panelClickEvent = function () {
    if (hasPanel && panelStore.connectionPhase) {
      if (longPressed.value) {
        longPressed.value = false;
        return;
      }

      let fromCoordinate = panelStore.connection.from;
      let from = panelStore.panels.getValue(fromCoordinate.col, fromCoordinate.row);
      
      // Do not connect to other channels
      if (p_panel.value?.channel !== from?.channel) return;

      panelStore.connection.to = props.coordinate;
      panelStore.addConnection();
    }

    // Only add panel when not in connection pahse to prevent unwanted clicks 
    else if (!panelStore.connectionPhase) {
      panelStore.addPanel(props.coordinate);
    }
  }

</script>

<template>
  <v-sheet 
    ref="target"
    :style="panelStyle" 
    @click="panelClickEvent"
    class="rounded-lg border"
    :class="p_panel !== null ? 'selected' : 'unselected'" 
    :elevation="p_panel !== null ? 9 : 0"  
  >

    <v-menu 
      v-if="p_panel !== null"
      transition="scale-transform" 
    >

      <template 
        v-slot:activator="{ props }"
      >
        <v-btn
          color="grey-darken-2"
          v-bind="props"
          icon="mdi-cog"
          size="small"
        />
      </template>

      <v-list>
        <v-list-item
          v-for="chan in channelFilter"
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
  .selected {
    transform: v-bind(panelTransform);
    transition: transform 0.25s ease-out;
    transform-style: preserve-3d;
  }

  .unselected {
    animation: reverse-select 0.5s forwards;
  }

  .unselected:hover {
    animation: select 0.5s forwards;
  }

  @keyframes select {
    from {
      transform: scale(1);
    }
    to {
      transform: scale(0.9);
      background-color: v-bind(panelStore.channelToColor(panelStore.currentChannel)); 
    }
  }

  @keyframes reverse-select {
    from {
      transform: scale(0.9);
      background-color: v-bind(panelStore.channelToColor(panelStore.currentChannel)); 
    }
    to {
      transform: scale(1);
    }
  }
</style>
