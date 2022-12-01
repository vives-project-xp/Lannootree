<script>
import axios from 'axios'

  export default {
    data: () => ({
      loading: [],
      files: [],
      rules: [
        value => {
          return !value || !value.length || value[0].size < 2000000000 || 'Avatar size should be less than 2 GB!'
        },
      ],
    }),
    methods: {
      load (i) {
        this.loading[i] = true
        setTimeout(() => (this.loading[i] = false), 3000)
      },
      post (files) {
        // van hieruit zouden de files moeten worden verstuurd
        axios.post('http://localhost:3000/upload/post', this.files, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })
      }
    },
  }
</script>

<template>
  <v-row>
    <v-file-input
      v-model="files"
      accept="image/png, image/jpeg, image/gif, image/bmp, video/mp4, video/quicktime"
      color="#00BD7E"
      counter
      label="Upload media"
      multiple
      placeholder="Select images, gifs and video's"
      prepend-icon="mdi-camera"
      variant="outlined"
      :show-size="1000"
      :rules="rules"
    >
      <template v-slot:selection="{ fileNames }">
        <template v-for="(fileName, index) in fileNames" :key="fileName">
          <v-chip
            v-if="index < 4 "
            color="#00BD7E"
            label
            size="small"
            class="mr-2"
          >
            {{ fileName }}
          </v-chip>
  
          <span
            v-else-if="index === 4"
            class="text-overline text-grey-darken-3 mx-2"
          >
            +{{ files.length - 4 }} File(s)
          </span>
        </template>
      </template>
    </v-file-input>
    <v-btn
      :loading="loading[4]"
      :disabled="loading[4]"
      color="#00BD7E"
      icon="mdi-cloud-upload"
      @click="load(4); post();"
      class="ml-1"
    ></v-btn>
</v-row>
  </template>
<style>
.custom-loader {
  animation: loader 1s infinite;
  display: flex;
}
@-moz-keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
@-webkit-keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
@-o-keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
@keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>