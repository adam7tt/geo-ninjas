import Vue from 'vue'
import VueRouter from 'vue-router'
import GMap from '@/components/home/GMap'
import Signup from '@/components/auth/Signup'
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'GMap',
    component: GMap
  },
  {
    path:'/signup',
    name: 'Signup',
    component: Signup
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
