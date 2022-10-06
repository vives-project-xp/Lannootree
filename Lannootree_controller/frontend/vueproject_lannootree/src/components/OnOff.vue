<template>
  <div>
    <Toggle v-model="isOn" on-label="On" off-label="Off" />
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
        isOn: true
      }
    }
  }
</script>

<style src="@vueform/toggle/themes/default.css"></style>