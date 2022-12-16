<script setup lang="ts">
  import { onUpdated, ref, computed } from 'vue'
  import JsonData from '@/components/configView/JsonData.vue'
  import OptionMenu from '@/components/configView/OptionMenu.vue'
  import PanelTableVue from '@/components/configView/PanelTable.vue'
  import InfoPopUp from '@/components/configView/InfoPopUp.vue'

  import { useDraggable } from '@vueuse/core'
  import { useClipboard } from '@vueuse/core';
  import { notify } from '@kyvg/vue3-notification'
  import { useWindowSize } from '@vueuse/core';
  import { usePanelGrid } from '@/stores/PanelGrid';
  import { useMouseInElement } from '@vueuse/core'
  import { useDisplayOptions } from '@/stores/DisplayOptions'
  import { useContainerLogging } from '@/stores/container.logging';
  import type { Popup } from '@/assets/ConfigView/Popup'
  import TutorialSteps from '@/assets/ConfigView/TutorialSteps'

  const error = ref(false);
  const posted = ref(false);
  const showPopup = ref(false);

  const loggingStore = useContainerLogging();

  const panelStore = usePanelGrid();
  const display_options = useDisplayOptions();

  const tutorialStep = ref(0);

  const { text, copy, copied, isSupported } = useClipboard({ source: panelStore.toJson });

  const centerScreen = computed(() => {
    const { width, height } = useWindowSize();

    return {
      top: (height.value / 2) - 150,
      left: (width.value / 2) - 150
    };
  });

  const popupInfo = ref<Popup>({
    description: "Welcome to this tutorial. This will teach you how to use the config panel.",
    buttonText: "Next",
  });

  const copyToClipboard = function() {
    copy(panelStore.toJson);
    notify({
      title: 'Copied to clipboard'
    });
  };

  const postConfig = function() {
    let obj = {
      type: 'config',
      config: panelStore.toJson
    };

    console.log("sending config")

    loggingStore.ws.send(JSON.stringify(obj));
  };

  const startTutorial = function() {
    showPopup.value = true;
  };
  
  onUpdated(() => {
    posted.value = false;
  });
  
  const el = ref<HTMLElement | null>(null);
  const { x, y, style } = useDraggable(el, {
    initialValue: { x: centerScreen.value.left, y: centerScreen.value.top },
    preventDefault: true
  });

  const panel = ref<HTMLElement | null>(null);
  const json = ref<HTMLElement | null>(null);

  const tutorialSteps = TutorialSteps(popupInfo, x, y);

  const nextPopup = function() {
    
    let requirement = tutorialSteps[tutorialStep.value](panel);

    tutorialStep.value++;
  };


</script>

<template>
  <div class="fill-height d-flex flex-column">
    <div 
      v-if="showPopup"
      ref="el"
      :style="style" 
      style="position: fixed; z-index: 5;"
    >  
      <InfoPopUp
        v-model="popupInfo"
        @button-clicked="nextPopup"
      />
    </div>

    <v-row style="max-height: 50px">
      <v-col cols="11" class="d-flex align-start justify-start" max-height="100px">
        <OptionMenu/>
      </v-col>
      <v-col cols="1">

        <v-btn
        @click="startTutorial"
        >
        Tutorial
          <v-overlay 
            :z-index="0" 
            :persistent="true"
            activator="parent"
            location-strategy="connected"
          ></v-overlay>
        </v-btn>
      </v-col>
    </v-row>
    
    <v-row>
      <v-col 
        :cols="display_options.options.show_json ? 8 : 12" 
        class="d-flex align-center justify-center"
      >
        <div
          ref="panel"
        >
          <PanelTableVue/>
        </div>
      </v-col>
      
      <v-col
        v-if="display_options.options.show_json"
        cols="4"
        class="d-flex flex-column align-center justify-center"
      >
        <div ref="json">
          <JsonData
            @click="copyToClipboard"
            style="pointer-events: none;"
          />
  
          <v-btn
            v-if="!posted && !error"
            color="success"
            @click="postConfig"
          >
            Post
          </v-btn>
  
          <v-btn
            v-if="error"
            color="red"
            disabled
          >
            Error
          </v-btn>
        </div>
      </v-col>
    </v-row>

    <notifications position="bottom right" />
  </div>
</template>

<style scoped>
  .focus {
    z-index: 3;
  }
</style>
