import { createRouter, createWebHistory } from 'vue-router'
import ConfigViewVue from '@/views/configView/ConfigView.vue'
import UploadViewVue from '@/views/frontendView/UploadView.vue'
import LoggingViewVue from '@/views/configView/LoggingView.vue'
import MediaViewVue from '@/views/frontendView/MediaView.vue'


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
      path: "/upload",
      name: "upload",
      component: UploadViewVue
    },
    {
      path: "/media",
      name: "media",
      component: MediaViewVue
    }
  ]
})

export default router
