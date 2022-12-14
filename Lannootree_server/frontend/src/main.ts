import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify'
import { loadFonts } from './plugins/webfontloader'

import Notifications from '@kyvg/vue3-notification'

import VueHighlightJS from 'vue3-highlightjs'
import 'highlight.js/styles/androidstudio.css'

import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faListAlt } from '@fortawesome/free-regular-svg-icons';

library.add(faListAlt)

import { autoAnimatePlugin } from '@formkit/auto-animate/vue'

loadFonts()

createApp(App)
  .component('font-awesome-icon' ,FontAwesomeIcon)
  .use(router)
  .use(vuetify)
  .use(createPinia())
  .use(autoAnimatePlugin)
  .use(Notifications)
  .use(VueHighlightJS)
  .mount('#app')
