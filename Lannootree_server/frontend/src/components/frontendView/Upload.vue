<script>
import axios from 'axios'
import { useClientAPIStore } from '@/stores/client.connection';
import { computed } from 'vue';

export default {
  setup() {
    const clientStore = useClientAPIStore();

    const calculateProgress = () => {
      const frame = clientStore.render_status_json.frame || 0;
      const totalFrames = clientStore.render_status_json.totalFrames || 1; // Prevent division by zero
      if (frame === totalFrames) {
        if ('Notification' in window) {
          Notification.requestPermission().then(function (permission) {
            if (permission === 'granted') {
              new Notification('Lannootree', {
                body: 'Your file has been succesfully rendered!',
                
              });
            }
          });
        } else {
          console.log('This browser does not support notifications.');
        }
        }
      return Math.ceil((frame / totalFrames) * 100);
    };

    const renderStatus = computed(() => {
      const frame = clientStore.render_status_json.frame;
      const totalFrames = clientStore.render_status_json.totalFrames;
      if (totalFrames === 0) {
        return "";
      }
      return `${frame}/${totalFrames}`;
    });
    

    return {
      calculateProgress,
      renderStatus
    };
  },
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
    async post() {
      if (!this.form || !this.files.length || !this.name || !this.description) {
        // Validate form fields
        console.error('Form data is incomplete');
        return;
      }
      
      this.loading = true;

      try {
        const formData = new FormData();
        formData.append("name", this.name);
        formData.append("description", this.description);
        formData.append("file", this.files[0]);

        const response = await axios.post('upload/post', formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          }
        });

        console.log('Upload response:', response.data);
        this.name = null;
        this.description = null;
        this.files = [];
      } catch (error) {
        console.error('Error uploading file:', error);
      } finally {
        this.loading = false;
      }
    },
    required(v) {
      return !!v || 'Field is required';
    },
  },
  computed: {
    progressColor() {
      return this.calculateProgress() === 100 ? 'light-green-darken-4' : 'blue-darken-4' ;
    }
  }
}
</script>

<template>
  <v-form
        v-model="form"
        @submit.prevent="onSubmit"
      >
    <v-file-input
      v-model="files"
      accept="image/gif"
      color="#00BD7E"
      counter
      label="Upload media"
      placeholder="Select gifs"
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
    <v-progress-linear
      :model-value="calculateProgress()"
      :color="progressColor"
      height="20"
      striped
    ><template v-slot:default="{ value }">
        <strong>{{ renderStatus }}</strong>
      </template></v-progress-linear>
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
