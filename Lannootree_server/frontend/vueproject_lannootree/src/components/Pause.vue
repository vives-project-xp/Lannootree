<template>
  <div>
    <Toggle v-model="notPaused" on-label="Pause" off-label="Play" @click="Pausing()"/>
  </div>
</template>

<script >
import { Pause } from "@/assets/api-connection.js"

  function Pausing() {
	  Pause(notPaused)
 }
  import Toggle from '@vueform/toggle'

  export default {
    components: {
      Toggle,
    },
    data() {
      return {
        notPaused: true
      }
    }
  }
</script>

<style src="@vueform/toggle/themes/default.css"></style>
