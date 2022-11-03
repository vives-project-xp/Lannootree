<script setup lang="ts">
  import { ref, computed } from 'vue'
  import OptionMenu from '@/components/OptionMenu.vue'
  import Panel from '@/components/Panel.vue'
  import { notify } from '@kyvg/vue3-notification'
  import { usePanelGrid } from '@/stores/PanelGrid'

  const _fun_ = ref(false);
  const fun = "\r\n\u2500\u2500\u2500\u2500\u2500\u2500\u2584\u258C\u2590\u2580\u2580\u2580\u2580\u2580\u2580\u2580\u2580\u2580\u2580\u2580\u2580\u2580\u2580\u2580\u2580\u2580\u2580\u2580\u2580\u258C   \u2500\u2500\u2500\u2500\u2500\u2500\u2584\u258C\u2590\u2580\u2580\u2580\u2580\u2580\u2580\u2580\u2580\u2580\u2580\u2580\u2580\u2580\u2580\u2580\u2580\u2580\u2580\u2580\u2580\u258C\r\n\u2500\u2500\u2500\u2584\u2584\u2588\u2588\u258C\u2588 BEEP BEEP              \u2500\u2500\u2500\u2584\u2584\u2588\u2588\u258C\u2588 BOOP BOOP\r\n\u2584\u2584\u2584\u258C\u2590\u2588\u2588\u258C\u2588 The nerd truck         \u2584\u2584\u2584\u258C\u2590\u2588\u2588\u258C\u2588 De Waterbeer\r\n\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u258C\u2588\u2584\u2584\u2584\u2584\u2584\u2584\u2584\u2584\u2584\u2584\u2584\u2584\u2584\u2584\u2584\u2584\u2584\u2584\u2584\u2584\u258C   \u2588\u2588\u2588\u2588\u2588\u2588\u2588\u258C\u2588\u2584\u2584\u2584\u2584\u2584\u2584\u2584\u2584\u2584\u2584\u2584\u2584\u2584\u2584\u2584\u2584\u2584\u2584\u2584\u2584\u258C\r\n\u2580(\u2299)\u2580\u2580\u2580\u2580\u2580\u2580\u2580(\u2299)(\u2299)\u2580\u2580\u2580\u2580\u2580\u2580\u2580\u2580\u2580\u2580(\u2299)   \u2580(\u2299)\u2580\u2580\u2580\u2580\u2580\u2580\u2580(\u2299)(\u2299)\u2580\u2580\u2580\u2580\u2580\u2580\u2580\u2580\u2580\u2580(\u2299)"

  const display_options = ref({
    effect_3d: true,
    show_json: false
  });

  const panelStore = usePanelGrid();

  const boxSize = computed(() => {
    if (panelStore.totalPanels < 64) return '100px';
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

    style['background-color'] = (panelStore.channelToColor(channel) as string);

    return style;
  };

  const _fun = computed(() => {
    // return atob(fun);
    return fun;
  });
</script>

<template>
  <div class="fill-height d-flex flex-column">
    <notifications position="bottom right" />
    
    <v-row style="max-height: 50px">
      <v-col cols="12" class="d-flex align-start justify-start" max-height="100px">
        <OptionMenu
          v-model="display_options"
        />
      </v-col>
    </v-row>
    
    <v-row>
      <v-col :cols="display_options.show_json ? 8 : 12" class="d-flex align-center justify-center">
        <v-sheet>
          <v-sheet :style="rowStyle">
            <div v-for="row in panelStore.panels.dimention()[1]" :key="`row${row}`" :style="colStyle" :id="`row: ${row - 1}`">
              <div v-for="col in panelStore.panels.dimention()[0]" :key="`col${col}`" :id="`col: ${col - 1}`">
                <Panel :coordinate="{ col: col - 1, row: row - 1 }"/>
              </div>
            </div>
          </v-sheet>
        </v-sheet>
      </v-col>

      <v-col
        v-if="display_options.show_json"
        cols="4"
        class="d-flex align-center justify-center"
      >
      
        <!-- <div class="json_display" @click="copyToClipboard" :style="validConfig ? { cursor: 'copy' } : { cursor: 'not-allowed' }"> -->
        <div class="json_display" @click.ctrl="_fun_ = !_fun_" >
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


    <!-- <v-row> -->
      <!-- <v-col col="12" class="d-flex align-center justify-center"> -->
        <!-- TODO: Make this an other component -->
      <!-- </v-col> -->
    <!-- </v-row> -->
  </div>

  
</template>

<style scoped>

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
