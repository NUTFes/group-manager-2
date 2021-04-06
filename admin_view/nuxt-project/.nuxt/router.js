import Vue from 'vue'
import Router from 'vue-router'
import { interopDefault } from './utils'
import scrollBehavior from './router.scrollBehavior.js'

const _7b07e52f = () => interopDefault(import('../pages/assign_items/index.vue' /* webpackChunkName: "pages/assign_items/index" */))
const _9dd34628 = () => interopDefault(import('../pages/assign_rental_items/index.vue' /* webpackChunkName: "pages/assign_rental_items/index" */))
const _5f70c93c = () => interopDefault(import('../pages/employees/index.vue' /* webpackChunkName: "pages/employees/index" */))
const _2b0ac3dc = () => interopDefault(import('../pages/food_products/index.vue' /* webpackChunkName: "pages/food_products/index" */))
const _18c34093 = () => interopDefault(import('../pages/groups/index.vue' /* webpackChunkName: "pages/groups/index" */))
const _7f52cd64 = () => interopDefault(import('../pages/inspire.vue' /* webpackChunkName: "pages/inspire" */))
const _6faa4a12 = () => interopDefault(import('../pages/mypage.vue' /* webpackChunkName: "pages/mypage" */))
const _b56e505c = () => interopDefault(import('../pages/news/index.vue' /* webpackChunkName: "pages/news/index" */))
const _1cd49f1e = () => interopDefault(import('../pages/place_allow_lists/index.vue' /* webpackChunkName: "pages/place_allow_lists/index" */))
const _1eaf94c8 = () => interopDefault(import('../pages/place_orders/index.vue' /* webpackChunkName: "pages/place_orders/index" */))
const _77c5f90b = () => interopDefault(import('../pages/places/index.vue' /* webpackChunkName: "pages/places/index" */))
const _176bae0e = () => interopDefault(import('../pages/power.vue' /* webpackChunkName: "pages/power" */))
const _d5ce7d44 = () => interopDefault(import('../pages/power_orders/index.vue' /* webpackChunkName: "pages/power_orders/index" */))
const _2c169a19 = () => interopDefault(import('../pages/project_names/index.vue' /* webpackChunkName: "pages/project_names/index" */))
const _2fb4bc54 = () => interopDefault(import('../pages/purchase_lists/index.vue' /* webpackChunkName: "pages/purchase_lists/index" */))
const _2aa33390 = () => interopDefault(import('../pages/regist_user_detail.vue' /* webpackChunkName: "pages/regist_user_detail" */))
const _77506f53 = () => interopDefault(import('../pages/rentable_items/index.vue' /* webpackChunkName: "pages/rentable_items/index" */))
const _831f01b6 = () => interopDefault(import('../pages/rental_item_allow_lists/index.vue' /* webpackChunkName: "pages/rental_item_allow_lists/index" */))
const _66145138 = () => interopDefault(import('../pages/rental_items/index.vue' /* webpackChunkName: "pages/rental_items/index" */))
const _16030857 = () => interopDefault(import('../pages/rental_orders/index.vue' /* webpackChunkName: "pages/rental_orders/index" */))
const _288eb418 = () => interopDefault(import('../pages/shops/index.vue' /* webpackChunkName: "pages/shops/index" */))
const _5ee1db54 = () => interopDefault(import('../pages/signup.vue' /* webpackChunkName: "pages/signup" */))
const _2c3a22aa = () => interopDefault(import('../pages/stage_common_options/index.vue' /* webpackChunkName: "pages/stage_common_options/index" */))
const _1faa9885 = () => interopDefault(import('../pages/stage_orders/index.vue' /* webpackChunkName: "pages/stage_orders/index" */))
const _b53a0298 = () => interopDefault(import('../pages/stages/index.vue' /* webpackChunkName: "pages/stages/index" */))
const _47ba2bbb = () => interopDefault(import('../pages/stocker_items/index.vue' /* webpackChunkName: "pages/stocker_items/index" */))
const _58dc60f2 = () => interopDefault(import('../pages/stocker_places/index.vue' /* webpackChunkName: "pages/stocker_places/index" */))
const _18296e94 = () => interopDefault(import('../pages/sub_reps/index.vue' /* webpackChunkName: "pages/sub_reps/index" */))
const _1fbc60ea = () => interopDefault(import('../pages/user_page_setting/index.vue' /* webpackChunkName: "pages/user_page_setting/index" */))
const _123c2dff = () => interopDefault(import('../pages/users/index.vue' /* webpackChunkName: "pages/users/index" */))
const _497a2d5d = () => interopDefault(import('../pages/users/print/index.vue' /* webpackChunkName: "pages/users/print/index" */))
const _17493152 = () => interopDefault(import('../pages/assign_items/_id.vue' /* webpackChunkName: "pages/assign_items/_id" */))
const _522eaa54 = () => interopDefault(import('../pages/assign_rental_items/_id.vue' /* webpackChunkName: "pages/assign_rental_items/_id" */))
const _45d7eaa4 = () => interopDefault(import('../pages/employees/_id.vue' /* webpackChunkName: "pages/employees/_id" */))
const _121fe578 = () => interopDefault(import('../pages/food_products/_id.vue' /* webpackChunkName: "pages/food_products/_id" */))
const _8183688a = () => interopDefault(import('../pages/groups/_id.vue' /* webpackChunkName: "pages/groups/_id" */))
const _566ea6ba = () => interopDefault(import('../pages/news/_id.vue' /* webpackChunkName: "pages/news/_id" */))
const _b6c85df4 = () => interopDefault(import('../pages/place_allow_lists/_id.vue' /* webpackChunkName: "pages/place_allow_lists/_id" */))
const _168221f8 = () => interopDefault(import('../pages/place_orders/_id.vue' /* webpackChunkName: "pages/place_orders/_id" */))
const _93f67b9a = () => interopDefault(import('../pages/places/_id.vue' /* webpackChunkName: "pages/places/_id" */))
const _58038346 = () => interopDefault(import('../pages/power_orders/_id.vue' /* webpackChunkName: "pages/power_orders/_id" */))
const _04864ec1 = () => interopDefault(import('../pages/project_names/_id.vue' /* webpackChunkName: "pages/project_names/_id" */))
const _e183bc84 = () => interopDefault(import('../pages/purchase_lists/_id.vue' /* webpackChunkName: "pages/purchase_lists/_id" */))
const _58c82a7b = () => interopDefault(import('../pages/rentable_items/_id.vue' /* webpackChunkName: "pages/rentable_items/_id" */))
const _51ee06cd = () => interopDefault(import('../pages/rental_item_allow_lists/_id.vue' /* webpackChunkName: "pages/rental_item_allow_lists/_id" */))
const _8bcb3a68 = () => interopDefault(import('../pages/rental_items/_id.vue' /* webpackChunkName: "pages/rental_items/_id" */))
const _3695347f = () => interopDefault(import('../pages/rental_orders/_id.vue' /* webpackChunkName: "pages/rental_orders/_id" */))
const _d540d548 = () => interopDefault(import('../pages/shops/_id.vue' /* webpackChunkName: "pages/shops/_id" */))
const _0264c792 = () => interopDefault(import('../pages/stage_common_options/_id.vue' /* webpackChunkName: "pages/stage_common_options/_id" */))
const _5b9ef82d = () => interopDefault(import('../pages/stage_orders/_id.vue' /* webpackChunkName: "pages/stage_orders/_id" */))
const _23491e1c = () => interopDefault(import('../pages/stages/_id.vue' /* webpackChunkName: "pages/stages/_id" */))
const _71c5e0e3 = () => interopDefault(import('../pages/stocker_items/_id.vue' /* webpackChunkName: "pages/stocker_items/_id" */))
const _168c07af = () => interopDefault(import('../pages/stocker_places/_id.vue' /* webpackChunkName: "pages/stocker_places/_id" */))
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
    path: "/assign_items",
    component: _7b07e52f,
    name: "assign_items"
  }, {
    path: "/assign_rental_items",
    component: _9dd34628,
    name: "assign_rental_items"
  }, {
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
    path: "/news",
    component: _b56e505c,
    name: "news"
  }, {
    path: "/place_allow_lists",
    component: _1cd49f1e,
    name: "place_allow_lists"
  }, {
    path: "/place_orders",
    component: _1eaf94c8,
    name: "place_orders"
  }, {
    path: "/places",
    component: _77c5f90b,
    name: "places"
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
    path: "/rentable_items",
    component: _77506f53,
    name: "rentable_items"
  }, {
    path: "/rental_item_allow_lists",
    component: _831f01b6,
    name: "rental_item_allow_lists"
  }, {
    path: "/rental_items",
    component: _66145138,
    name: "rental_items"
  }, {
    path: "/rental_orders",
    component: _16030857,
    name: "rental_orders"
  }, {
    path: "/shops",
    component: _288eb418,
    name: "shops"
  }, {
    path: "/signup",
    component: _5ee1db54,
    name: "signup"
  }, {
    path: "/stage_common_options",
    component: _2c3a22aa,
    name: "stage_common_options"
  }, {
    path: "/stage_orders",
    component: _1faa9885,
    name: "stage_orders"
  }, {
    path: "/stages",
    component: _b53a0298,
    name: "stages"
  }, {
    path: "/stocker_items",
    component: _47ba2bbb,
    name: "stocker_items"
  }, {
    path: "/stocker_places",
    component: _58dc60f2,
    name: "stocker_places"
  }, {
    path: "/sub_reps",
    component: _18296e94,
    name: "sub_reps"
  }, {
    path: "/user_page_setting",
    component: _1fbc60ea,
    name: "user_page_setting"
  }, {
    path: "/users",
    component: _123c2dff,
    name: "users"
  }, {
    path: "/users/print",
    component: _497a2d5d,
    name: "users-print"
  }, {
    path: "/assign_items/:id",
    component: _17493152,
    name: "assign_items-id"
  }, {
    path: "/assign_rental_items/:id",
    component: _522eaa54,
    name: "assign_rental_items-id"
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
    path: "/news/:id",
    component: _566ea6ba,
    name: "news-id"
  }, {
    path: "/place_allow_lists/:id",
    component: _b6c85df4,
    name: "place_allow_lists-id"
  }, {
    path: "/place_orders/:id",
    component: _168221f8,
    name: "place_orders-id"
  }, {
    path: "/places/:id",
    component: _93f67b9a,
    name: "places-id"
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
    path: "/rentable_items/:id",
    component: _58c82a7b,
    name: "rentable_items-id"
  }, {
    path: "/rental_item_allow_lists/:id",
    component: _51ee06cd,
    name: "rental_item_allow_lists-id"
  }, {
    path: "/rental_items/:id",
    component: _8bcb3a68,
    name: "rental_items-id"
  }, {
    path: "/rental_orders/:id",
    component: _3695347f,
    name: "rental_orders-id"
  }, {
    path: "/shops/:id",
    component: _d540d548,
    name: "shops-id"
  }, {
    path: "/stage_common_options/:id",
    component: _0264c792,
    name: "stage_common_options-id"
  }, {
    path: "/stage_orders/:id",
    component: _5b9ef82d,
    name: "stage_orders-id"
  }, {
    path: "/stages/:id",
    component: _23491e1c,
    name: "stages-id"
  }, {
    path: "/stocker_items/:id",
    component: _71c5e0e3,
    name: "stocker_items-id"
  }, {
    path: "/stocker_places/:id",
    component: _168c07af,
    name: "stocker_places-id"
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
