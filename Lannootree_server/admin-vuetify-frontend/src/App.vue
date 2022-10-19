<script setup lang="ts">
  import { ref, watch } from 'vue'

  const drawer = ref(false);
  const group = ref(null);

  const items = [
    {
      title: 'ConfigPanel',
      value: 'config'
    },
    {
      title: 'LogPanel',
      value: 'logging'
    }
  ];

  watch(group, () => {
    drawer.value = false;
  });

</script>

<template>
  <v-app>
    <v-app-bar app color="grey-darken-3">
      <template v-slot:prepend>
        <v-app-bar-nav-icon variant="text" @click.stop="drawer = !drawer" ></v-app-bar-nav-icon>
      </template>

      <v-app-bar-title>Lanootree admin page</v-app-bar-title>
      
      <v-btn to="/">
        <v-icon>mdi-home</v-icon>
      </v-btn>
      
      <v-btn href="https://github.com/vives-project-xp/Lannootree">
        <v-icon>mdi-github</v-icon>
      </v-btn>
    </v-app-bar>

    <v-navigation-drawer 
      v-model="drawer"
      bottom
      temporary
    >
      <v-list>
        <v-list-item
          v-for="sub in items"
          :key="sub.value"
          :to="sub.value">

            {{ sub.title }}
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-main>
      <v-container fluid>
        <router-view></router-view>
      </v-container>
    </v-main>

    <!-- <v-footer app>
      
    </v-footer> -->
  </v-app>
</template>

