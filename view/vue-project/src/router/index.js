import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Welcome from '../views/Welcome.vue'
import About from '../views/About.vue'
import MyPage from '../views/MyPage.vue'
import RegisterUserDetail from '../views/RegisterUserDetail.vue'
import RegistSubRep from '../views/RegistSubRep.vue'
import RegisterGroup from '../views/RegisterGroup.vue'
import RegisterPowerOrder from '../views/RegisterPowerOrder.vue'

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
    path: '/register_user_detail',
    name: 'RegisterUserDetail',
    component: RegisterUserDetail
  },
  {
    path: '/regist_sub_rep',
    name: 'RegistSubRep',
    component: RegistSubRep
  },
  {
    path: '/register_group',
    name: 'RegisterGroup',
    component: RegisterGroup
  },
  {
    path: '/register_power_order',
    name: 'RegisterPowerOrder',
    component: RegisterPowerOrder
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
