import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'

import Notifications from '@kyvg/vue3-notification'

import VueHighlightJS from 'vue3-highlightjs'
import 'highlight.js/styles/androidstudio.css'

import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap'

import './assets/base.css'

import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faListAlt } from '@fortawesome/free-regular-svg-icons';

library.add(faListAlt)

import { autoAnimatePlugin } from '@formkit/auto-animate/vue'

createApp(App)
  .component('font-awesome-icon' ,FontAwesomeIcon)
  .use(autoAnimatePlugin)
  .use(Notifications)
  .use(VueHighlightJS)
  .use(createPinia())
  .mount('#app')