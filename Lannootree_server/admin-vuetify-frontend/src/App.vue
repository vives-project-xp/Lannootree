<template>
  <v-app>
    <!-- <v-navigation-drawer app> -->
      <!-- -->
    <!-- </v-navigation-drawer> -->

    <v-app-bar app>
      <v-app-bar-title>Chuck Norris Questionnaire</v-app-bar-title>
      
      <v-spacer></v-spacer>

      <v-btn to="/" color="dark">Home</v-btn>
      <v-btn to="/About" color="dark">About</v-btn>
      
      <v-spacer></v-spacer>
    </v-app-bar>

    <!-- Sizes your content based upon application components -->
    <v-main>
      <!-- Provides the application the proper gutter -->
      <v-container fluid>

        <!-- If using vue-router -->
        <router-view></router-view>
      </v-container>
    </v-main>

    <v-footer app>
      <!-- -->
    </v-footer>
  </v-app>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'App',

  data () {
    return {
      //
    }
  },
})
</script>
