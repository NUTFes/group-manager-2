import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Welcome from '../views/Welcome.vue'
import About from '../views/About.vue'
import MyPage from '../views/mypage.vue'
import UserDetail from '../views/user_detail.vue'
import SubRep from '../views/sub_rep.vue'
import Place from '../views/place.vue'
import Group from '../views/group.vue'
import Power from '../views/power.vue'

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
    path: '/user_detail',
    name: 'UserDetail',
    component: UserDetail
  },
  {
    path: '/group',
    name: 'Group',
    component: Group
  }, 
  {
    path: '/place',
    name: 'Place',
    component: Place
  },
  {
    path: '/power',
    name: 'Power',
    component: Power
  },
  {
    path: '/sub_rep',
    name: 'SubRep',
    component: SubRep
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
