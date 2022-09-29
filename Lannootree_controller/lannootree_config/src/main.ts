import { createApp } from 'vue'
import App from './App.vue'

import Notifications from '@kyvg/vue3-notification'

import VueHighlightJS from 'vue3-highlightjs'
import 'highlight.js/styles/androidstudio.css'
import './assets/base.css'


createApp(App)
  .use(VueHighlightJS)
  .use(Notifications)
  .mount('#app')