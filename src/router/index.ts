import { createRouter, createWebHistory } from 'vue-router'
import ControlPanelView from '../views/ControlPanelView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'control-panel',
      component: ControlPanelView
    },
    {
      path: '/favorites',
      name: 'favorites',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/FavoritesView.vue')
    }
  ]
})

export default router
