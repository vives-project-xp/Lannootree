<script setup lang="ts">
  import { ref, computed } from 'vue'
  import Panel from '@/components/Panel.vue'
  import { notify } from '@kyvg/vue3-notification'
  import { usePanelGrid } from '@/stores/PanelGrid'
import { useBase64 } from '@vueuse/core';

  const _fun_ = ref(false);
  const fun = "\r\n\u2500\u2500\u2500\u2500\u2500\u2500\u2584\u258C\u2590\u2580\u2580\u2580\u2580\u2580\u2580\u2580\u2580\u2580\u2580\u2580\u2580\u2580\u2580\u2580\u2580\u2580\u2580\u2580\u2580\u258C\r\n\u2500\u2500\u2500\u2584\u2584\u2588\u2588\u258C\u2588 BEEP BEEP\r\n\u2584\u2584\u2584\u258C\u2590\u2588\u2588\u258C\u2588 The nerd truck\r\n\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u258C\u2588\u2584\u2584\u2584\u2584\u2584\u2584\u2584\u2584\u2584\u2584\u2584\u2584\u2584\u2584\u2584\u2584\u2584\u2584\u2584\u2584\u258C\r\n\u2580(\u2299)\u2580\u2580\u2580\u2580\u2580\u2580\u2580(\u2299)(\u2299)\u2580\u2580\u2580\u2580\u2580\u2580\u2580\u2580\u2580\u2580(\u2299";

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

  const _fun = computed(() => {
    // return atob(fun);
    return fun;
  });
</script>

<template>
  <div>
    <notifications position="bottom right" />

    <v-row>
      <v-col col="12">
        <v-sheet class="d-flex align-center justify-center ma-5">
          <v-sheet :style="rowStyle">
            <div v-for="row in panelStore.panels.dimention()[1]" :key="`row${row}`" :style="colStyle" :id="`row: ${row - 1}`">
              <div v-for="col in panelStore.panels.dimention()[0]" :key="`col${col}`" :id="`col: ${col - 1}`">
                <Panel :coordinate="{ col: col - 1, row: row - 1 }"/>
              </div>
            </div>
          </v-sheet>
        </v-sheet>

        <v-sheet v-auto-animate>
          <v-row>
            <v-col 
              v-for="chan in changeableChannels" 
              :key="`chanBtn${chan.shortName}`" 
              col="4"
              class="text-center"
            >
              <v-btn>
                {{ chan.name }}
              </v-btn>
            </v-col>
          </v-row>
        </v-sheet>
      </v-col>

      
    </v-row>
    <v-row>
      <v-col col="12" class="d-flex align-center justify-center">
        <!-- TODO: Make this an other component -->
        <!-- <div class="json_display" @click="copyToClipboard" :style="validConfig ? { cursor: 'copy' } : { cursor: 'not-allowed' }"> -->
        <div class="json_display" @click="_fun_ = !_fun_">
            <pre v-highlightjs v-if="!_fun_">
              <code class="javascript" style="border-radius: 25px">{{ panelStore.toJson }}</code>
            </pre>
            <pre class="truk" v-else>
              <br/>
              {{ _fun }}
            </pre>
        </div>
      </v-col>
    </v-row>



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

  .truk {
    position: relative;
    animation-name: example;
    animation-duration: 4s;
  }

  @keyframes example {
    0%   { left:400px; top:0px;}
    100% { left:0px; top:0px;}
  }
</style>
