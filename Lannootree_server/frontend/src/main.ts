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
import Toast, { PluginOptions } from "vue-toastification";
// Import the CSS or use your own!
import "vue-toastification/dist/index.css";


const options: PluginOptions = {
  position: "bottom-right",
  timeout: false,
  closeOnClick: true,
  pauseOnFocusLoss: true,
  pauseOnHover: true,
  draggable: true,
  draggablePercent: 0.6,
  showCloseButtonOnHover: false,
  hideProgressBar: false,
  closeButton: "button",
  icon: true,
  rtl: false,
  newestOnTop: true
};

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
  .use(Toast, options)
  .mount('#app')
