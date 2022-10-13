<script >
import { Pause } from "@/assets/api-connection.js"

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
        notPaused: true
      }
    },
    Pausing(test) {
      Pause(test)
    }
  }
</script>

<template>
  <div>
    <Toggle v-model="notPaused" on-label="Pause" off-label="Play" @click="Pausing(notPaused)"/>
  </div>
</template>

<style src="@vueform/toggle/themes/default.css"></style>
