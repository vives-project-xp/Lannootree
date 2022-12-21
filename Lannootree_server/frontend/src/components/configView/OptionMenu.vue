<script setup lang="ts">
  import { ref } from 'vue'
  import { usePanelGrid } from '@/stores/PanelGrid';
  import { useDisplayOptions } from '@/stores/DisplayOptions';

  const tab = ref(null);
  const panelStore =  usePanelGrid();
  const display_options = useDisplayOptions();

</script>

<template>
  <v-menu
    open-on-hover
    :close-on-content-click="false"
    location="end"
  >
    <template v-slot:activator="{ props }">
      <v-btn
        v-bind="props"
        class="ma-4"
      >
        Options
      </v-btn>

      <v-btn href="http://traefik.lannootree.devbitapp.be" target="_blank" class="ma-4">
        Traefik
      </v-btn>

      <v-btn href="https://lannootree.devbitapp.be/nodered" target="_blank" class="ma-4">
        Nodered
      </v-btn>

      <v-btn href="https://lannootree.devbitapp.be/phpmyadmin" target="_blank" class="ma-4">
        phpmyadmin
      </v-btn>
  
    </template>

    <v-card>
      <v-toolbar>
        <v-toolbar-title>Config Options</v-toolbar-title>
      </v-toolbar>

      <div class="d-flex flex-row">
        <v-tabs
          v-model="tab"
          direction="vertical"
        >
  
          <v-tab value="channel_select">
            Channel Select
          </v-tab>
  
          <v-tab value="display_settings">
            Display
          </v-tab>
          

        </v-tabs>
        
        <v-window v-model="tab">
          <v-window-item value="channel_select">
            <v-card
              class="mx-auto"
            >
              <v-row 
                v-for="chan in panelStore.channels" 
                :key="`chanBtn${chan.shortName}`" 
                col="4"
                class="text-center ma-5 d-flex align-center justify-center"
              >
                <v-btn
                  @click="panelStore.currentChannel = chan.shortName"
                  :color="panelStore.channelToColor(chan.shortName)"
                  :elevation="panelStore.currentChannel == chan.shortName ? 9 : 0"
                >
                  {{ chan.name }}
                </v-btn>
              </v-row>
            </v-card>
          </v-window-item>

          <v-window-item value="display_settings">
            <v-row>
              <v-col>
                <v-switch 
                label="3d-effect" 
                class="ml-3 mr-3"
                color="green"
                v-model="display_options.options.effect_3d"
                />

                <v-switch 
                label="show json" 
                class="ml-3 mr-3"
                color="green"
                v-model="display_options.options.show_json"
                />
              </v-col>
            </v-row>
          </v-window-item>
        </v-window>
      </div>
    </v-card>
  </v-menu>
</template>
