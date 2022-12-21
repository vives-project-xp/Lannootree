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

      <v-card
    max-width="700"
    class="mx-auto mt-4"
  >
  <v-card-title>Informatie</v-card-title>
    <v-container>
      <v-row dense>
        <v-col cols="12">
          <v-card
            color="#385F73"
            theme="dark"
            to="media"
          >
            <v-card-title class="text-h5">
              Media Page
            </v-card-title>

            <v-card-text>In de media pagina kan je verschillende gifs sturen naar de Lannnootree.</v-card-text>
          </v-card>
        </v-col>

        <v-col cols="12">
          <v-card
            color="#1F7087"
            theme="dark"
            to="upload"
          >
            <v-card-title class="text-h5">
              Upload
            </v-card-title>

            <v-card-text>Op deze pagina kan je gifs en fotos gaan importeren, deze gaan dan afspelen op de Lannootree.</v-card-text>
          </v-card>
        </v-col>

        <v-col cols="12">
          <v-card
            color="#952175"
            theme="dark"
            to="config"
          >
            <v-card-title class="text-h5">
              Config
            </v-card-title>

            <v-card-text>Hier kan je gaan aanduiden hoeveel panelen er verbonden zijn en welke paneel met welk paneel verbonden is.</v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12">
          <v-card
            color="#00bd7e"
            theme="dark"
            to="logging"
          >
            <v-card-title class="text-h5">
              Logs
            </v-card-title>

            <v-card-text>Met dit logpaneel kan je zien welke containers wel of niet online zijn. Er worden naar deze pagina berichten gestuurd met info over de containers.</v-card-text>

          </v-card>
        </v-col>
      </v-row>
    </v-container>
      </v-card>
      
      <h1 class="text-center mt-4">
        Blogpost
      </h1>

      <div class="text-center">
        <img src="../../assets/frontendView/Blogpost.png" alt="blogpost" style="max-width: 90%"/>
      </div>
  </div>
</template>

<style scoped>

</style>
