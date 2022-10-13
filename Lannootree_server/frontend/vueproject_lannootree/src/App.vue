<script setup>

// import Websocket from '../src/assets/api-connection.js';
import Stop from './components/Stop.vue';
import Title from './components/Title.vue'
import Pause from './components/Pause.vue';
import Effects from './components/Effects.vue';
import Color from './components/Color.vue';
// import {effect} from '@/src/assets/api-connection.js';

import Logout from './components/Logout.vue';
import Assets from './components/Assets.vue';
// import UserInterface from './components/UserInterface.vue'

</script>

<template>
  <header>
    <img alt="Vue logo" class="logo" src="./assets/logo.svg" width="125" height="125" />

    <div class="wrapper">
      <Title msg="Lannootree" />
      <Logout />
    </div>
  </header>

  <main>

    <div class="components">
    <Stop />
    <Pause />
    <Effects />
    <Assets />
    
  </div>
  <div class="componentsrow2">
    <Color />
  </div>
  </main>
</template>

<style scoped>
header {
  line-height: 1.5;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  main {
    min-height: 400px;
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }
}
</style>
