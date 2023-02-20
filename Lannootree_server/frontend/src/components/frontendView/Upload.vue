<script setup lang="ts">
  import { ref } from 'vue'
  import axios from 'axios'

  const loading = ref(false);

  const data = ref({
    form: false,
    name: "",
    description: "",
    loading: false,
    files: [],
    rules: [
      (value: any) => {
        return !value || !value.length || value[0].size < 2000000000 || 'Avatar size should be less than 2 GB!'
      },
      (value: any) => {
        return !!value || 'Field is required';
      }
    ], 
  });

  const post = async function () {
    if (!data.value.form) return;
    loading.value = true;

    let formData = new FormData();
    formData.append("name", data.value.name);
    formData.append("description", data.value.description);

    for (let i = 0; i < data.value.files.length; i++) {
      console.log(data.value.files[i]);
      formData.append('files', data.value.files[i]);
    }

    axios({
      method: 'post',
      url: 'http://localhost:3000/upload/post',
      data: formData,
    })
    .then(res => {
      console.log(res);
      loading.value = false;
    })
    .catch(err => {
      console.error(err);
    });
  }

  const requiredFiledRule = function (v: any) {
    return !!v || 'Field is required';
  }

</script>

<template>
  <v-form
        v-model="data.form"
      >
    <v-file-input
      v-model="data.files"
      accept="image/png, image/jpeg, image/gif, image/bmp, video/mp4, video/quicktime"
      color="#00BD7E"
      counter
      label="Upload media"
      multiple
      placeholder="Select images, gifs and video's"
      prepend-icon="mdi-camera"
      variant="outlined"
      :show-size="1000"
      :rules="data.rules"
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
            +{{ data.files.length - 4 }} File(s)
          </span>
        </template>
      </template>
    </v-file-input>
  <v-row>
    <v-text-field label="Add name" variant="solo" class="ml-8 my-4 px-8" :rules="[requiredFiledRule]" v-model="data.name" clearable></v-text-field>
    <v-text-field label="Add description" variant="solo" class="ml-8 my-4 px-8" :rules="[requiredFiledRule]" v-model="data.description" clearable></v-text-field>
    <v-btn
      :loading="loading"
      :disabled="!data.form"
      color="#00BD7E"
      icon="mdi-cloud-upload"
      @click="post"
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
