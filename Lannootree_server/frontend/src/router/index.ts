import { createRouter, createWebHistory } from 'vue-router'
import ConfigViewVue from '@/views/configView/ConfigView.vue'
import ControlViewVue from '@/views/frontendView/ControlView.vue'
import LoggingViewVue from '@/views/configView/LoggingView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/config",
      name: "config",
      component: ConfigViewVue
    },
    {
      path: "/logging",
      name: "logging",
      component: LoggingViewVue
    },
    {
      path: "/controll",
      name: "controll",
      component: ControlViewVue
    }
  ]
})

export default router
