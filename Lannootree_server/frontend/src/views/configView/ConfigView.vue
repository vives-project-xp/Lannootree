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

  const { text, copy, copied, isSupported } = useClipboard({ source: panelStore.toJson });

  const centerScreen = computed(() => {
    const { width, height } = useWindowSize();

    return {
      top: (height.value / 2) - 150,
      left: (width.value / 2) - 150
    };
  });

  const popupInfo = ref<Popup>({
    description: "",
    buttonText: "",
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

  
  onUpdated(() => {
    posted.value = false;
  });
  
  const el = ref<HTMLElement | null>(null);
  const { x, y, style } = useDraggable(el, {
    initialValue: { x: centerScreen.value.left, y: centerScreen.value.top },
    preventDefault: true
  });
  
  const tutorial = ref(false);
  const tutorialStep = ref(0);
  
  const panel = ref<HTMLElement | null>(null);
  const options = ref<HTMLElement | null>(null);
  const json = ref<HTMLElement | null>(null);
  
  const startTutorial = function() {
    popupInfo.value.description = "Welcome to this tutorial.\n\n\
     Here i will teach you how to use the config panel.\n\n\
     Just so you know:\n\
     if i'm in the way, try draging me away 👋.";
    popupInfo.value.buttonText = "Next";
    showPopup.value = true;
    tutorial.value = true;
  };

  const getTutorialTarget = computed(() => {
    if (tutorialStep.value < 5) return panel;
    if (tutorialStep.value == 5) return options;
    if (tutorialStep.value == 6) return panel;
    return json;
  });

  const tutorialSteps = TutorialSteps(popupInfo, x, y);

  const nextPopup = function() {
    if (tutorialStep.value > 7) {
      tutorialStep.value = 0;
      tutorial.value = false;
      showPopup.value = false;
    }

    let requirement: any = tutorialSteps[tutorialStep.value](getTutorialTarget.value);

    if (requirement != undefined) 
      requirement(nextPopup);

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
        <div ref="options">
          <OptionMenu/>
        </div>
      </v-col>
      <v-col cols="1">

        <v-btn
          @click="startTutorial"
        >
        Tutorial
          <v-overlay 
            :z-index="0" 
            :persistent="true"
            v-model="tutorial"
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
