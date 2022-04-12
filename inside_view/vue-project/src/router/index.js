import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/Home.vue'
import Display from '@/views/Display.vue'
import Signup from '@/views/Signup.vue'
import Signin from '@/views/Signin.vue'
import Item from '@/views/Item.vue'
import Power from '@/views/Power.vue'
import Group from '@/views/Group.vue'


const routes = [
  {
    path: '/place',
    name: 'Place',
    component: Home,
  },
  {
    path: '/display',
    name: 'Display',
    component: Display,
  },
  {
    path: '/signup',
    name: 'Signup',
    component: Signup,
  },
  {
    path: '/signin',
    name: 'Signin',
    component: Signin,
  },
  {
    path: '/item',
    name: 'Item',
    component: Item,
  },
  {
    path: '/power',
    name: 'Power',
    component: Power,
  },
  {
    path: '/group',
    name: 'Group',
    component: Group,
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
