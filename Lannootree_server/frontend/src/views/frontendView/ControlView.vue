<script setup lang="ts">
  import Stop from '@/components/frontendView/Stop.vue'
  import Pause from '@/components/frontendView/Pause.vue'
  import Effects from '@/components/frontendView/Effects.vue'
  import Assets from '@/components/frontendView/Assets.vue'
  import Color from '@/components/frontendView/Color.vue'
  import LannootreeGrid from '@/components/frontendView/LannootreeGrid.vue'
  import Title from '@/components/frontendView/Title.vue'
  import logo from '@/assets/frontendView/logo.svg'

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
        <Effects class="ma-3"/>
        <Assets class="ma-3"/>

      </v-col>
    </v-row>

    <v-row>
      <v-col 
        cols="10"
        offset="1"
        class="d-flex justify-center align-center"
      >
        <Color/>
      </v-col>
    </v-row>
  </div>
</template>
