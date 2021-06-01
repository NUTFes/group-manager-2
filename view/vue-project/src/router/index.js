import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import Welcome from "../views/Welcome.vue";
import About from "../views/About.vue";
import MyPage from "../views/mypage.vue";
import UserDetail from "../views/user_detail.vue";
import SubRep from "../views/sub_rep.vue";
import Place from "../views/place.vue";
import Group from "../views/group.vue";
import Power from "../views/power.vue";
import RegistShop from "../views/regist_shop.vue";
import RegistGroup from "../views/regist_group.vue";
import RegistFoodBooths from "../views/regist_food_booths.vue";
import RegistPurchase from "../views/regist_purchase.vue";
import Firstcustomer from "../views/FirstCustomer.vue";
import EditUserInfo from "../views/edit_user_info.vue";
import PasswordReset from "../views/password_reset.vue";
import Profile from "../views/profile.vue";
import MobileWelcome from "../views/Mobile/Welcome.vue";
import MobileMypage from "../views/Mobile/Mypage.vue";
import MobilePower from "../views/Mobile/power.vue"
import MobilePasswordReset from "../views/Mobile/password_reset.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Welcome",
    component: Welcome
  },
  {
    path: "/about",
    name: "About",
    component: About
  },
  {
    path: "/mypage",
    name: "MyPage",
    component: MyPage
  },
  {
    path: "/user_detail",
    name: "UserDetail",
    component: UserDetail
  },
  {
    path: "/group",
    name: "Group",
    component: Group
  },
  {
    path: "/place",
    name: "Place",
    component: Place
  },
  {
    path: "/power",
    name: "Power",
    component: Power
  },
  {
    path: "/sub_rep",
    name: "SubRep",
    component: SubRep
  },
  {
    path: "/regist_shop",
    name: "RegistShop",
    component: RegistShop
  },
  {
    path: "/regist_group",
    name: "RegistGroup",
    component: RegistGroup
  },
  {
    path: "/regist_food_booths",
    name: "RegistFoodBooths",
    component: RegistFoodBooths
  },
  {
    path: "/regist_purchase",
    name: "RegistPurchase",
    component: RegistPurchase
  },

  {
    path: "/firstcustomer",
    name: "Firstcustomer",
    component: Firstcustomer
  },
  {
    path: "/password_reset",
    name: "PasswordReset",
    component: PasswordReset
  },
  {
    path: "/edit_user_info",
    name: "EditUserInfo",
    component: EditUserInfo
  },
  {
    path: "/profile",
    name: "Profile",
    component: Profile
  },
  {
    path: "/mobile_welcome",
    name: "MobileWelcome",
    component: MobileWelcome,
  },
  {
    path: "/mobile_mypage",
    name: "MobileMypage",
    component: MobileMypage,
  },
  {
    path: "/mobile_power",
    name: "MobilePower",
    component: MobilePower,
  },
  {
    path: "/mobile_password_reset",
    name: "MobilePasswordReset",
    component: MobilePasswordReset,
  },
];

const router = new VueRouter({
  mode: "history",
  // base: process.env.BASE_URL,
  // base: process.env.VUE_APP_URL,
  routes,
  scrollBehavior(to, from, savedPosition) {
    return { x: 0, y: 0 };
  }
});

export default router;
