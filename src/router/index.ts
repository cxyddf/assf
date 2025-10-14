import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: () => import('../views/Home.vue')
    },
    {
      path: '/list',
      name: 'List',
      component: () => import('../views/List.vue')
    },
    {
      path: '/detail/:id',
      name: 'Detail',
      component: () => import('../views/Detail.vue'),
      props: true
    },
    {
      path: '/search',
      name: 'Search',
      component: () => import('../views/Search.vue')
    }
  ]
})

export default router