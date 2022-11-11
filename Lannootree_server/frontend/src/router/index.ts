import { createRouter, createWebHistory } from 'vue-router'
import ConfigViewVue from '@/views/configView/ConfigView.vue'
import ControlViewVue from '@/views/frontendView/ControlView.vue'
import UploadViewVue from '@/views/frontendView/UploadView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/config",
      name: "config",
      component: ConfigViewVue
    },
    {
      path: "/controll",
      name: "controll",
      component: ControlViewVue
    },
    {
      path: "/upload",
      name: "upload",
      component: UploadViewVue
    }
  ]
})

export default router
