<script setup lang="ts">
  import { useClientAPIStore } from '@/stores/client.connection';
  import { ref, computed } from 'vue';
  import { useToast } from "vue-toastification";
  import { useToastStore } from '@/stores/ToastStore';
  
  const clientStore = useClientAPIStore();
  const toastStore = useToastStore();
  const toast = useToast();
  const current = ref('')
  

  const calculateProgress = () => {
    const frame = clientStore.render_status_json.frame || 0;
    const totalFrames = clientStore.render_status_json.totalFrames || 1; // Prevent division by zero
    const progress = (frame / totalFrames) * 100;
    if (frame == 1) {
      // when more than 1 frame has been done, reset shownstate so that notifications for following uploads can be shown.
      toastStore.setSuccessToastShown(false);        
    }
    if (frame == 1 && !toastStore.getUploadToastShown()) {
      toastStore.setUploadToastShown(true);
      toast.info("File uploaded, rendering!", {
        timeout: 8000
      });
    }

    if (progress >= 100 && !toastStore.getSuccessToastShown()) {
      toast.success("Congratulations! Your file has been successfully uploaded to the server.");
      toastStore.setSuccessToastShown(true);
      toastStore.setUploadToastShown(false);
    }
    return progress;
  };

  const renderStatus = computed(() => {
    const frame = clientStore.render_status_json.frame;
    const totalFrames = clientStore.render_status_json.totalFrames;
    if (totalFrames === 0) {
      return "";
    }
    return `${frame}/${totalFrames}`;
  });
  
  
  function sendId(idToSend: Number) {
  // `event` implicitly has `any` type
  clientStore.setMedia(idToSend)
  clientStore.setMedia(idToSend)
  console.log(clientStore.status_json.active.media_id)
  }
</script>
    
<template>
    <v-row
      class="d-flex align-center justify-center"
    >
      <v-btn
        v-for="label in clientStore.status_json.media"
        :key="`chip_${label.name}`"
        class="ma-3"
        :color="clientStore.status_json.active.media_id == label.id ? '#00bd7e' : 'secondary'"
        @click="sendId(label.id)"
      >
        {{ label.name }}
      </v-btn>
    </v-row>
    <!-- This hidden element below enables notifications -->
    <p class="d-none">{{ calculateProgress() }}</p>
</template>
