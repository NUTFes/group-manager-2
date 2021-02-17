import Vue from 'vue'
import Router from 'vue-router'
import { interopDefault } from './utils'
import scrollBehavior from './router.scrollBehavior.js'

const _5f70c93c = () => interopDefault(import('../pages/employees/index.vue' /* webpackChunkName: "pages/employees/index" */))
const _2b0ac3dc = () => interopDefault(import('../pages/food_products/index.vue' /* webpackChunkName: "pages/food_products/index" */))
const _18c34093 = () => interopDefault(import('../pages/groups/index.vue' /* webpackChunkName: "pages/groups/index" */))
const _7f52cd64 = () => interopDefault(import('../pages/inspire.vue' /* webpackChunkName: "pages/inspire" */))
const _6faa4a12 = () => interopDefault(import('../pages/mypage.vue' /* webpackChunkName: "pages/mypage" */))
const _1eaf94c8 = () => interopDefault(import('../pages/place_orders/index.vue' /* webpackChunkName: "pages/place_orders/index" */))
const _176bae0e = () => interopDefault(import('../pages/power.vue' /* webpackChunkName: "pages/power" */))
const _d5ce7d44 = () => interopDefault(import('../pages/power_orders/index.vue' /* webpackChunkName: "pages/power_orders/index" */))
const _2c169a19 = () => interopDefault(import('../pages/project_names/index.vue' /* webpackChunkName: "pages/project_names/index" */))
const _2fb4bc54 = () => interopDefault(import('../pages/purchase_lists/index.vue' /* webpackChunkName: "pages/purchase_lists/index" */))
const _2aa33390 = () => interopDefault(import('../pages/regist_user_detail.vue' /* webpackChunkName: "pages/regist_user_detail" */))
const _66145138 = () => interopDefault(import('../pages/rental_items/index.vue' /* webpackChunkName: "pages/rental_items/index" */))
const _16030857 = () => interopDefault(import('../pages/rental_orders/index.vue' /* webpackChunkName: "pages/rental_orders/index" */))
const _5ee1db54 = () => interopDefault(import('../pages/signup.vue' /* webpackChunkName: "pages/signup" */))
const _1faa9885 = () => interopDefault(import('../pages/stage_orders/index.vue' /* webpackChunkName: "pages/stage_orders/index" */))
const _18296e94 = () => interopDefault(import('../pages/sub_reps/index.vue' /* webpackChunkName: "pages/sub_reps/index" */))
const _123c2dff = () => interopDefault(import('../pages/users/index.vue' /* webpackChunkName: "pages/users/index" */))
const _497a2d5d = () => interopDefault(import('../pages/users/print/index.vue' /* webpackChunkName: "pages/users/print/index" */))
const _45d7eaa4 = () => interopDefault(import('../pages/employees/_id.vue' /* webpackChunkName: "pages/employees/_id" */))
const _121fe578 = () => interopDefault(import('../pages/food_products/_id.vue' /* webpackChunkName: "pages/food_products/_id" */))
const _8183688a = () => interopDefault(import('../pages/groups/_id.vue' /* webpackChunkName: "pages/groups/_id" */))
const _168221f8 = () => interopDefault(import('../pages/place_orders/_id.vue' /* webpackChunkName: "pages/place_orders/_id" */))
const _58038346 = () => interopDefault(import('../pages/power_orders/_id.vue' /* webpackChunkName: "pages/power_orders/_id" */))
const _04864ec1 = () => interopDefault(import('../pages/project_names/_id.vue' /* webpackChunkName: "pages/project_names/_id" */))
const _e183bc84 = () => interopDefault(import('../pages/purchase_lists/_id.vue' /* webpackChunkName: "pages/purchase_lists/_id" */))
const _8bcb3a68 = () => interopDefault(import('../pages/rental_items/_id.vue' /* webpackChunkName: "pages/rental_items/_id" */))
const _3695347f = () => interopDefault(import('../pages/rental_orders/_id.vue' /* webpackChunkName: "pages/rental_orders/_id" */))
const _5b9ef82d = () => interopDefault(import('../pages/stage_orders/_id.vue' /* webpackChunkName: "pages/stage_orders/_id" */))
const _2aabf408 = () => interopDefault(import('../pages/sub_reps/_id.vue' /* webpackChunkName: "pages/sub_reps/_id" */))
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
    path: "/employees",
    component: _5f70c93c,
    name: "employees"
  }, {
    path: "/food_products",
    component: _2b0ac3dc,
    name: "food_products"
  }, {
    path: "/groups",
    component: _18c34093,
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
    path: "/place_orders",
    component: _1eaf94c8,
    name: "place_orders"
  }, {
    path: "/power",
    component: _176bae0e,
    name: "power"
  }, {
    path: "/power_orders",
    component: _d5ce7d44,
    name: "power_orders"
  }, {
    path: "/project_names",
    component: _2c169a19,
    name: "project_names"
  }, {
    path: "/purchase_lists",
    component: _2fb4bc54,
    name: "purchase_lists"
  }, {
    path: "/regist_user_detail",
    component: _2aa33390,
    name: "regist_user_detail"
  }, {
    path: "/rental_items",
    component: _66145138,
    name: "rental_items"
  }, {
    path: "/rental_orders",
    component: _16030857,
    name: "rental_orders"
  }, {
    path: "/signup",
    component: _5ee1db54,
    name: "signup"
  }, {
    path: "/stage_orders",
    component: _1faa9885,
    name: "stage_orders"
  }, {
    path: "/sub_reps",
    component: _18296e94,
    name: "sub_reps"
  }, {
    path: "/users",
    component: _123c2dff,
    name: "users"
  }, {
    path: "/users/print",
    component: _497a2d5d,
    name: "users-print"
  }, {
    path: "/employees/:id",
    component: _45d7eaa4,
    name: "employees-id"
  }, {
    path: "/food_products/:id",
    component: _121fe578,
    name: "food_products-id"
  }, {
    path: "/groups/:id",
    component: _8183688a,
    name: "groups-id"
  }, {
    path: "/place_orders/:id",
    component: _168221f8,
    name: "place_orders-id"
  }, {
    path: "/power_orders/:id",
    component: _58038346,
    name: "power_orders-id"
  }, {
    path: "/project_names/:id",
    component: _04864ec1,
    name: "project_names-id"
  }, {
    path: "/purchase_lists/:id",
    component: _e183bc84,
    name: "purchase_lists-id"
  }, {
    path: "/rental_items/:id",
    component: _8bcb3a68,
    name: "rental_items-id"
  }, {
    path: "/rental_orders/:id",
    component: _3695347f,
    name: "rental_orders-id"
  }, {
    path: "/stage_orders/:id",
    component: _5b9ef82d,
    name: "stage_orders-id"
  }, {
    path: "/sub_reps/:id",
    component: _2aabf408,
    name: "sub_reps-id"
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
