<script>
import axios from 'axios'

  export default {
    data: () => ({
      form: false,
      name: null,
      description: null,
      loading: false,
      files: [],
      rules: [
        value => {
          return !value || !value.length || value[0].size < 2000000000 || 'Avatar size should be less than 2 GB!'
        },
      ],
    }),
    methods: {
      post (files) {
        if (!this.form || !this.files.length) return
        this.loading = true
        setTimeout(() => (this.loading = false), 3000)
        let formData = new FormData();
        formData.append("name", this.name)
        formData.append("description", this.description)
        formData.append("file", this.files[0])
          
        
        
        return axios.post('upload/post', formData, {
          headers: {
            "content-Type": "multipart/form-data",
          }
        })
      },
      required (v) {
        return !!v || 'Field is required'
      },
    },
  }
</script>

<template>
  <v-form
        v-model="form"
        @submit.prevent="onSubmit"
      >
    <v-file-input
      v-model="files"
      accept="image/png, image/jpeg, image/gif, image/bmp, video/mp4, video/quicktime"
      color="#00BD7E"
      counter
      label="Upload media"
      placeholder="Select images, gifs and video's"
      prepend-icon="mdi-camera"
      variant="outlined"
      :show-size="1000"
      :rules="rules.concat(required)"
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
  <v-row>
    <v-text-field label="Add name" variant="solo" class="ml-8 my-4 px-8" :rules="[required]" v-model="name" clearable></v-text-field>
    <v-text-field label="Add description" variant="solo" class="ml-8 my-4 px-8" :rules="[required]" v-model="description" clearable></v-text-field>
    <v-btn
      :loading="loading"
      :disabled="!form"
      color="#00BD7E"
      icon="mdi-cloud-upload"
      @click="post();"
      class="mt-4 mr-8"
    ></v-btn>
  </v-row>
</v-form>
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
