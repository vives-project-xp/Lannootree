<script setup lang="ts">
  import Upload from '@/components/frontendView/Upload.vue'
  import logo from '@/assets/frontendView/logo.svg'
  import Title from '@/components/frontendView/Title.vue'
  import Stop from '@/components/frontendView/Stop.vue'
  import Pause from '@/components/frontendView/Pause.vue'
</script>

<template>
  <div>
    <v-row>
        <v-col
          cols="12"
          class="d-flex align-center justify-center"
        >
          <v-img 
            alt="Vue logo" 
            class="logo" 
            :src="logo" 
            max-width="150px"
          />

          <div
            class="ma-5 d-flex"
          >
            <Title msg="Lannootree"/>
            <Logout/>
          </div>
        </v-col>
      </v-row>

      <v-row>
        <v-col 
          cols="12"
          class="d-flex justify-center align-center"
        >

          <Pause class="ma-3"/>
          <Stop class="ma-3"/>

        </v-col>
      </v-row>
      
    <Upload class="ma-3"/>
  </div>
</template>

<style scoped>

</style>
