import { createRouter, createWebHistory } from 'vue-router'
import ConfigViewVue from '@/views/configView/ConfigView.vue'
import ControlViewVue from '@/views/frontendView/ControlView.vue'
<<<<<<< HEAD
import UploadViewVue from '@/views/frontendView/UploadView.vue'
=======
import LoggingViewVue from '@/views/configView/LoggingView.vue'
>>>>>>> 78580ae92295db118858bebe31cfce4d64c24ae8

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
    },
    {
      path: "/upload",
      name: "upload",
      component: UploadViewVue
    }
  ]
})

export default router
