import { createRouter, createWebHistory } from 'vue-router'


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect:'/Login'
    },
    {
      path: '/Login',
      name: 'Login',
      component: () => import('../views/Login/Login.vue')
    }
  ]
})

export default router
