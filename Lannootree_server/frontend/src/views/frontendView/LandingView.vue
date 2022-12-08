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
        <h1 class="text-center mt-16">
          Informatie
        </h1>

        <h2 class="text-center mt-4">
          Madia pagina
        </h2>
        <p class="text-center">
          In de media pagina kan je verschillende gifs sturen naar de Lannnootree.
        </p>

        <h2 class="text-center mt-4">
          Upload
        </h2>
        <p class="text-center">
          Op deze pagina kan je gifs en fotos gaan importeren, deze gaan dan afspelen op de Lannootree.
        </p>

        <h2 class="text-center mt-4">
          ConfigPanel
        </h2>
        <p class="text-center">
          Hier kan je gaan aanduiden hoeveel panelen er verbonden zijn en welke paneel met welk paneel verbonden is.
        </p>

        <h2 class="text-center mt-4">
          LogPanel
        </h2>
        <p class="text-center">
          Met dit logpaneel kan je zien welke containers wel of niet online zijn. Er worden naar deze pagina berichten gestuurd met info over de containers.
        </p>
      </div>

      <h1 class="text-center mt-4">
        Blogpost
      </h1>

      <div class="text-center">
        <img src="../../assets/frontendView/Blogpost.png" alt="blogpost"/>
      </div>
  </div>
</template>

<style scoped>

</style>
