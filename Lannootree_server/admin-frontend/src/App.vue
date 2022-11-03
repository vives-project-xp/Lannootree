<script setup lang="ts">
  import { computed, ref, watch } from 'vue'
  import { useUserStore }  from '@/stores/UserInfo'

  const drawer = ref(false);
  const group = ref(null);

  const userInfo = useUserStore();

  
  const items = computed(() => {    
    const _routes = [
      {
        title: 'ConfigPanel',
        value: 'config',
        group: 'admins'
      },
      {
        title: 'LogPanel',
        value: 'logging',
        group: 'admins'
      }
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

</script>

<template>
  <v-app>
    <v-app-bar app color="grey-darken-3">
      <template v-slot:prepend>
        <v-app-bar-nav-icon variant="text" @click.stop="drawer = !drawer" class="hidden-md-and-up"></v-app-bar-nav-icon>
      </template>

      <v-app-bar-title>Lannootree</v-app-bar-title>
      
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
      </v-list>
    </v-navigation-drawer>

    <v-main>
      <v-container class="fill-height" fluid>
        <router-view v-slot="{ Component }">

          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>

        </router-view>
      </v-container>
    </v-main>

    <v-footer app
      class="bg-grey-darken-3 text-center d-flex flex-column"
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
