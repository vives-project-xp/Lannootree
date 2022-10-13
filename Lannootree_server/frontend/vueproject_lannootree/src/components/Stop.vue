<script>
  import { Stop } from '@/assets/api-connection.js';

  function Stopping() {
	  Stop()
 }
</script>
    
<template>
  <button @click.native="Stopping" >Stop</button>
</template>