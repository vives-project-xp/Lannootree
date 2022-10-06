<script setup>
import Title from './components/Title.vue'
import Onoff from './components/OnOff.vue';
import Effects from './components/Effects.vue';
import Color from './components/Color.vue';
import Getfiles from './components/Getfiles.vue';
import Upload from './components/Upload.vue';
import Camera from './components/Camera.vue';
import Logout from './components/Logout.vue';
import TestButton from './components/TestButton.vue';
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
    <Onoff />
    <Effects />
    <Color />
    <Getfiles />
    <Upload />
    <Camera />
    <TestButton />
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
