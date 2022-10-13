<template>
  <div>
    <Toggle v-model="notPaused" on-label="Pause" off-label="Play" @click="Pause(notPaused)"/>
  </div>
</template>

<script >
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
