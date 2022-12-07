<script setup lang="ts">
  import logo from '@/assets/frontendView/logo.svg'
  import Title from '@/components/frontendView/Title.vue'
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

      
      <div>
        <h2 class="d-flex justify-center align-center">
          Madia pagina
        </h2>
        <p class="d-flex justify-center align-center">
          In de media pagina kan je verschillende gifs sturen naar de Lannnootree.
        </p>

        <h2 class="d-flex justify-center align-center">
          Upload
        </h2>
        <p class="d-flex justify-center align-center">
          Op deze pagina kan je gifs en fotos gaan importeren, deze gaan dan afspelen op de Lannootree.
        </p>

        <h2 class="d-flex justify-center align-center">
          ConfigPanel
        </h2>
        <p class="d-flex justify-center align-center">
          Hier kan je gaan aanduiden hoeveel panelen er verbonden zijn en welke paneel met welk paneel verbonden is.
        </p>

        <h2 class="d-flex justify-center align-center">
          LogPanel
        </h2>
        <p class="d-flex justify-center align-center">
          Met dit logpaneel kan je zien welke containers wel of niet online zijn. Er worden naar deze pagina berichten gestuurd met info over de containers.
        </p>
      </div>
          

     
      
  </div>
</template>

<style scoped>

</style>
