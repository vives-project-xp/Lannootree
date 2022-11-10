import { createRouter, createWebHistory } from 'vue-router'
import ConfigViewVue from '@/views/configView/ConfigView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/config",
      name: "config",
      component: ConfigViewVue
    }
  ]
})

export default router
