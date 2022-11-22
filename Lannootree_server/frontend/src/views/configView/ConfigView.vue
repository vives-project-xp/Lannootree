<script setup lang="ts">
  import JsonData from '@/components/configView/JsonData.vue'
  import OptionMenu from '@/components/configView/OptionMenu.vue'
  import PanelTableVue from '@/components/configView/PanelTable.vue'
  
  import { useClipboard } from '@vueuse/core';
  import { notify } from '@kyvg/vue3-notification'
  import { usePanelGrid } from '@/stores/PanelGrid';
  import { useDisplayOptions } from '@/stores/DisplayOptions'

  const panelStore = usePanelGrid();
  const display_options = useDisplayOptions();

  const { text, copy, copied, isSupported } = useClipboard({ source: panelStore.toJson });

  const copyToClipboard = function() {
    copy(panelStore.toJson);
    notify({
      title: 'Copied to clipboard'
    });
  }

</script>

<template>
  <div class="fill-height d-flex flex-column">
    
    <v-row style="max-height: 50px">
      <v-col cols="12" class="d-flex align-start justify-start" max-height="100px">
        <OptionMenu/>
      </v-col>
    </v-row>
    
    <v-row>
      <v-col 
        :cols="display_options.options.show_json ? 8 : 12" 
        class="d-flex align-center justify-center"
      >
        <PanelTableVue/>
      </v-col>
      
      <v-col
        v-if="display_options.options.show_json"
        cols="4"
        class="d-flex align-center justify-center"
      >
        <JsonData
          @click="copyToClipboard"
        />
      </v-col>
    </v-row>

    <notifications position="bottom right" />
  </div>
</template>
