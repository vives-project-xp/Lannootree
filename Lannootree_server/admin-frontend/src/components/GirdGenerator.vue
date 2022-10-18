<script setup lang="ts">
  import { ref, computed } from 'vue'
  import Panel from '@/components/Panel.vue'
  import { notify } from '@kyvg/vue3-notification'
  import { usePanelGrid } from '@/stores/PanelGrid'

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

  const button_style = function(channel: string) {
    let style = {
      margin: '5px',
      'background-color': 'none'
    };

    if (channel === 'CA0') style['background-color'] = 'red';
    if (channel === 'CA1') style['background-color'] = 'green';
    if (channel === 'CB0') style['background-color'] = 'blue';
    if (channel === 'CB1') style['background-color'] = 'yellow';

    return style;
  };

  const changeableChannels = computed(() => {
    let filter: { name: string, shortName: string}[] = [];
    panelStore.channels.forEach((chan: { name: string, shortName: string}) => {
      if (chan.shortName !== panelStore.currentChannel) filter.push(chan);
    });
    return filter;
  });

</script>

<template>
  <div class="wrapper">
    <notifications position="bottom right" />

    <div style="grid-area: box">
      <div :style="rowStyle" style="'grid-area' : 'box'">
        <div v-for="row in panelStore.panels.dimention()[1]" :key="`row${row}`" :style="colStyle" :id="`row: ${row - 1}`">
          <div v-for="col in panelStore.panels.dimention()[0]" :key="`col${col}`" :id="`col: ${col - 1}`">
            <Panel :coordinate="{ col: col - 1, row: row - 1 }"/>
          </div>
        </div>
      </div>
    </div>

    <div class="channel_buttons" v-auto-animate>
      <button 
        type="button"
        v-for="chan in changeableChannels" 
        :key="`chanBtn${chan.shortName}`" 
        class="btn btn-light" 
        :style="button_style(chan.shortName)"
        @click="panelStore.currentChannel = chan.shortName">
        {{ chan.name }}
      </button>
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
    grid-template-columns: 25px 1fr 1fr 25px; 
    grid-template-rows: 25px 2fr 1fr 25px; 
    gap: 5px 5px; 
    grid-template-areas: 
      ". . . ."
      ". box json ."
      ". buttons json ."
      ". . . ."; 
    justify-content: center; 
    align-content: center; 

    place-items: center; /* Just center nice and easy :) */
    
    height: 90vh;
  }

  .json_display {
    display: grid;
    grid-area: json;
    
    height: 80%;
    width: 80%;
    margin: 10px;

    overflow: scroll;
    scrollbar-width: none;

    border-radius: 25px;

    user-select: none;
  }

  .channel_buttons {
    grid-area: buttons;
  }
</style>
