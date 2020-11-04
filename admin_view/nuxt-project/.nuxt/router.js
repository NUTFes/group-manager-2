import Vue from 'vue'
import Router from 'vue-router'
import { interopDefault } from './utils'
import scrollBehavior from './router.scrollBehavior.js'

const _6a60f3e0 = () => interopDefault(import('../pages/groups.vue' /* webpackChunkName: "pages/groups" */))
const _7f52cd64 = () => interopDefault(import('../pages/inspire.vue' /* webpackChunkName: "pages/inspire" */))
const _6faa4a12 = () => interopDefault(import('../pages/mypage.vue' /* webpackChunkName: "pages/mypage" */))
const _56ce3ea1 = () => interopDefault(import('../pages/print.vue' /* webpackChunkName: "pages/print" */))
const _2aa33390 = () => interopDefault(import('../pages/regist_user_detail.vue' /* webpackChunkName: "pages/regist_user_detail" */))
const _5ee1db54 = () => interopDefault(import('../pages/signup.vue' /* webpackChunkName: "pages/signup" */))
const _123c2dff = () => interopDefault(import('../pages/users/index.vue' /* webpackChunkName: "pages/users/index" */))
const _42a8b7b2 = () => interopDefault(import('../pages/users/_id.vue' /* webpackChunkName: "pages/users/_id" */))
const _dc6fcb74 = () => interopDefault(import('../pages/index.vue' /* webpackChunkName: "pages/index" */))

// TODO: remove in Nuxt 3
const emptyFn = () => {}
const originalPush = Router.prototype.push
Router.prototype.push = function push (location, onComplete = emptyFn, onAbort) {
  return originalPush.call(this, location, onComplete, onAbort)
}

Vue.use(Router)

export const routerOptions = {
  mode: 'history',
  base: decodeURI('/'),
  linkActiveClass: 'nuxt-link-active',
  linkExactActiveClass: 'nuxt-link-exact-active',
  scrollBehavior,

  routes: [{
    path: "/groups",
    component: _6a60f3e0,
    name: "groups"
  }, {
    path: "/inspire",
    component: _7f52cd64,
    name: "inspire"
  }, {
    path: "/mypage",
    component: _6faa4a12,
    name: "mypage"
  }, {
    path: "/print",
    component: _56ce3ea1,
    name: "print"
  }, {
    path: "/regist_user_detail",
    component: _2aa33390,
    name: "regist_user_detail"
  }, {
    path: "/signup",
    component: _5ee1db54,
    name: "signup"
  }, {
    path: "/users",
    component: _123c2dff,
    name: "users"
  }, {
    path: "/users/:id",
    component: _42a8b7b2,
    name: "users-id"
  }, {
    path: "/",
    component: _dc6fcb74,
    name: "index"
  }],

  fallback: false
}

export function createRouter () {
  return new Router(routerOptions)
}
