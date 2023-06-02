import Vue from 'vue'
import VueRouter from 'vue-router'
import HomeView from '../views/HomeView.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/board',
    name: 'board',
    component: () => import('../views/BoardView.vue')
  },
  {
    path: '/map',
    name: 'map',
    component: () => import('../views/MapView.vue')
  },
  {
    path: '/plan',
    name: 'plan',
    component: () => import('../views/PlanListView.vue')
  },
  {
    path: '/mypage',
    name: 'mypage',
    component: () => import('../views/MyPageView.vue')
  },
  /*{
    path: '/gpt',
    name: 'gpt',
    component: () => import('../components/plan/GptComponent.vue')
  },*/
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
