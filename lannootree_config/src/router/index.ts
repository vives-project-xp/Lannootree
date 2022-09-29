import { createRouter, createWebHistory } from 'vue-router'
import GridViewVue from '@/views/GridView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: GridViewVue,
    }
  ]
})

export default router
