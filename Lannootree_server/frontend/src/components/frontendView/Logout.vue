<script setup lang="ts">
    const logoutUrl = import.meta.env.VITE_LOGOUT_URL;
</script>
    
<template>
  <v-btn 
    size="x-small"
    :href="logoutUrl" 
    class="linkbutton"
  >
    Log out
  </v-btn>
</template>