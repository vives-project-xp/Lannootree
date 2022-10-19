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
        clientStore: useClientAPIStore(),
        notPaused: true
      }
    }
  }
</script>

<template>
  <div>
    <Toggle v-model="notPaused" on-label="⏸" off-label="▶" @click="clientStore.Pause(notPaused)"/>
  </div>
</template>

<style src="@vueform/toggle/themes/default.css"></style>
