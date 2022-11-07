<script setup lang="ts">
  import { ref } from 'vue'
  import { usePanelGrid } from '@/stores/PanelGrid';
  
  const panelStore = usePanelGrid();
  
  const _fun_ = ref(false);
  const fun = "\r\n\u2500\u2500\u2500\u2500\u2500\u2500\u2584\u258C\u2590\u2580\u2580\u2580\u2580\u2580\u2580\u2580\u2580\u2580\u2580\u2580\u2580\u2580\u2580\u2580\u2580\u2580\u2580\u2580\u2580\u258C   \u2500\u2500\u2500\u2500\u2500\u2500\u2584\u258C\u2590\u2580\u2580\u2580\u2580\u2580\u2580\u2580\u2580\u2580\u2580\u2580\u2580\u2580\u2580\u2580\u2580\u2580\u2580\u2580\u2580\u258C\r\n\u2500\u2500\u2500\u2584\u2584\u2588\u2588\u258C\u2588 BEEP BEEP              \u2500\u2500\u2500\u2584\u2584\u2588\u2588\u258C\u2588 BOOP BOOP\r\n\u2584\u2584\u2584\u258C\u2590\u2588\u2588\u258C\u2588 The nerd truck         \u2584\u2584\u2584\u258C\u2590\u2588\u2588\u258C\u2588 De Waterbeer\r\n\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u258C\u2588\u2584\u2584\u2584\u2584\u2584\u2584\u2584\u2584\u2584\u2584\u2584\u2584\u2584\u2584\u2584\u2584\u2584\u2584\u2584\u2584\u258C   \u2588\u2588\u2588\u2588\u2588\u2588\u2588\u258C\u2588\u2584\u2584\u2584\u2584\u2584\u2584\u2584\u2584\u2584\u2584\u2584\u2584\u2584\u2584\u2584\u2584\u2584\u2584\u2584\u2584\u258C\r\n\u2580(\u2299)\u2580\u2580\u2580\u2580\u2580\u2580\u2580(\u2299)(\u2299)\u2580\u2580\u2580\u2580\u2580\u2580\u2580\u2580\u2580\u2580(\u2299)   \u2580(\u2299)\u2580\u2580\u2580\u2580\u2580\u2580\u2580(\u2299)(\u2299)\u2580\u2580\u2580\u2580\u2580\u2580\u2580\u2580\u2580\u2580(\u2299)";

</script>

<template>
   <!-- <div class="json_display" @click="copyToClipboard" :style="validConfig ? { cursor: 'copy' } : { cursor: 'not-allowed' }"> -->
    <div class="d-flex align-center justify-center" @click.ctrl="_fun_ = !_fun_" >
        <pre v-highlightjs v-if="!_fun_">
          <code class="javascript" style="border-radius: 25px">{{ panelStore.toJson }}</code>
        </pre>
        
        <pre class="truk" v-else>
          <br/>
          {{ fun }}
        </pre>
    </div>
</template>

<style scoped>
  .truk {
    position: relative;
    animation-name: example;
    animation-duration: 4s;
  }

  @keyframes example {
    0%   { left:400px; top:0px;}
    100% { left:0px; top:0px;}
  }
</style>
