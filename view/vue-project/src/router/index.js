import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Welcome from '../views/Welcome.vue'
import About from '../views/About.vue'
import MyPage from '../views/MyPage.vue'
import RegisterUserDetail from '../views/RegisterUserDetail.vue'
import RegistSubRep from '../views/RegistSubRep.vue'
import RegisterGroup from '../views/RegisterGroup.vue'
import User from '../views/User.vue'
import Venue from '../views/Venue.vue'
import Group from '../views/Group.vue'
import Power from '../views/Power.vue'

Vue.use(VueRouter)

  const routes = [
  {
    path: '/',
    name: 'Welcome',
    component: Welcome
  },
  {
    path: '/about',
    name: 'About',
    component: About
  },
  {
    path: '/mypage',
    name: 'MyPage',
    component: MyPage
  },
  {
    path: '/user',
    name: 'User',
    component: User
  },
  {
    path: '/group',
    name: 'Group',
    component: Group
  }, 
  {
    path: '/venue',
    name: 'Venue',
    component: Venue
  },
  {
    path: '/power',
    name: 'Power',
    component: Power
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
