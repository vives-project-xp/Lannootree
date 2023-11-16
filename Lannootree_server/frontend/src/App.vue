<script setup lang="ts">
  import { useTheme } from 'vuetify'
  import { computed, ref, watch } from 'vue'
  import { useUserStore }  from '@/stores/UserInfo'
import router from './router';

  const theme = useTheme();

  const drawer = ref(false);
  const group = ref(null);

  const userInfo = useUserStore();

  const logoutUrl = import.meta.env.VITE_LOGOUT_URL;
  
  const items = computed(() => {    
    const _routes = [
    {
        title: 'Media',
        value: 'media',
        group: 'admins'
      },
      {
        title: 'Upload',
        value: 'upload',
        group: 'admins'
      },
      {
        title: 'Config',
        value: 'config',
        group: 'admins'
      },
      {
        title: 'Logs',
        value: 'logging',
        group: 'admins'
      },
    ];
    
    let routes: { title: string, value: string, group: string }[] = [];

    (userInfo.userGroups as string[]).forEach(group => {
      routes.push(..._routes.filter(obj => obj.group == group));
    });
    
    return routes;
  });

  watch(group, () => {
    drawer.value = false;
  });

  const toggleTheme = function () {
    theme.global.name.value = theme.global.current.value.dark ? 'lightTheme' : 'darkTheme';
  }
  // Hotkeys 1,2,3,4 
  window.addEventListener('keydown', (e)=>{
    var key = e.which || e.keyCode;
    switch(key) {
      case 49:
        router.push('/media');
        break;
      case 50:
        router.push('/upload');
        break;
      case 51:
        router.push('/config');
        break;
      case 52:
        router.push('/logging');
        break;
    }
});
</script>

<template>
  <v-app>
    <v-app-bar app color="primary">
      <template v-slot:prepend>
        <v-app-bar-nav-icon variant="text" @click.stop="drawer = !drawer" class="hidden-md-and-up"></v-app-bar-nav-icon>
      </template>

      <v-btn to="/">Lannootree</v-btn>
      
      <v-spacer></v-spacer>

      <div
        v-for="sub in items"
        :key="sub.value"
        class="hidden-sm-and-down"
        >
        <v-btn
          :to="sub.value"
        >
          {{ sub.title }}
        </v-btn>
      </div>


      <v-btn
        @click="toggleTheme"
      >
        <v-icon v-if="theme.global.current.value.dark">mdi-weather-sunny</v-icon>
        <v-icon v-else>mdi-weather-night</v-icon>
      </v-btn>

      <v-btn 
        color="red"
        :variant="theme.global.current.value.dark ? 'outlined' : 'flat'"
        :href="logoutUrl" 
        class="hidden-sm-and-down ml-2"
      >
        Logout
      </v-btn>
      

    </v-app-bar>

    <v-navigation-drawer 
      v-model="drawer"
      bottom
      temporary
      class="hidden-md-and-up"
    >
      <v-list>
        <v-list-item
          v-for="sub in items"
          :key="sub.value"
          :to="sub.value">

            {{ sub.title }}
        </v-list-item>
        <v-list-item
        class="hidden-md-and-up"
        :href="logoutUrl"
        append-icon="mdi-logout">
        Logout
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-main>
      <v-container class="fill-height" fluid>
        <router-view v-slot="{ Component }">

          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
            <!-- zet hier tekst met info over de pagina's -->
            
        </router-view>
      </v-container>
    </v-main>

    <v-footer app
      class="text-center d-flex flex-column"
      color="primary"
    >
      <div>
        <v-btn
          class="mx-4"
          icon="mdi-github"
          variant="text"
          href="https://github.com/vives-project-xp/Lannootree"
        ></v-btn>
      </div>

      <v-divider></v-divider>

      <div>
        Lannootree project - {{ new Date().getFullYear() }}
        <p style="font-size: small;">Hosted by <a href="https://prowifi.be" target="_blank">ProWifi</a></p>
      </div>
    </v-footer>
  </v-app>
</template>

<style scoped>
  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
  }

  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.5s ease-out;
  }
</style>
