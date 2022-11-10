<script >
  import { useClientAPIStore } from '../stores/client.connection';
  // Replaced by useClientStore
  // import { Pause } from "@/assets/api-connection.js"

//   function Pausing() {
// 	  Pause(notPaused)
//  }
  import Toggle from '@vueform/toggle'

  export default {
    components: {
      Toggle,
    },
    data() {
      return {
        clientStore: useClientAPIStore()
      }
    }
  }
</script>

<template>
  <div>
    <Toggle v-model="clientStore.status_json.pause" on-label="⏸" off-label="▶" @click="clientStore.Pause(!paused)"/>
  </div>
</template>

<style src="@vueform/toggle/themes/default.css"></style>
