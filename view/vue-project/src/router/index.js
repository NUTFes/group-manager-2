import Vue from "vue";
import VueRouter from "vue-router";
import Welcome from "../views/Welcome.vue";
import About from "../views/About.vue";
import MyPage from "../views/Mypage.vue";
import UserDetail from "../views/UserDetail.vue";
import SubRep from "../views/SubRep.vue";
import Place from "../views/Place.vue";
import Group from "../views/Group.vue";
import Power from "../views/Power.vue";
import RegistShop from "../views/RegistShop.vue";
import RegistGroup from "../views/RegistGroup.vue";
import RegistFoodBooths from "../views/RegistFoodBooths.vue";
import RegistPurchase from "../views/RegistPurchase.vue";
import Firstcustomer from "../views/FirstCustomer.vue";
import EditUserInfo from "../views/EditUserInfo.vue";
import PasswordReset from "../views/PasswordReset.vue";
import Profile from "../views/Profile.vue";
import MobileWelcome from "../views/Mobile/Welcome.vue";
import MobileMypage from "../views/Mobile/Mypage.vue";
import MobileUserDetail from "../views/Mobile/UserDetail.vue";
import MobileGroup from "../views/Mobile/Group.vue";
import MobileSubRep from "../views/Mobile/SubRep.vue";
import MobileFirstCustomer from "../views/Mobile/FirstCustomer.vue";
import MobilePower from "../views/Mobile/Power.vue";
import MobilePasswordReset from "../views/Mobile/PasswordReset.vue";
import MobileRegistGroup from "../views/Mobile/RegistGroup.vue";
import MobileRegistShop from "../views/Mobile/RegistShop.vue";
import MobilePlace from "../views/Mobile/Place.vue";
import MobileEditUserInfo from "../views/Mobile/EditUserInfo.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Welcome",
    component: Welcome,
  },
  {
    path: "/about",
    name: "About",
    component: About,
  },
  {
    path: "/mypage",
    name: "MyPage",
    component: MyPage,
  },
  {
    path: "/user_detail",
    name: "UserDetail",
    component: UserDetail,
  },
  {
    path: "/group",
    name: "Group",
    component: Group,
  },
  {
    path: "/place",
    name: "Place",
    component: Place,
  },
  {
    path: "/power",
    name: "Power",
    component: Power,
  },
  {
    path: "/sub_rep",
    name: "SubRep",
    component: SubRep,
  },
  {
    path: "/regist_shop",
    name: "RegistShop",
    component: RegistShop,
  },
  {
    path: "/regist_group",
    name: "RegistGroup",
    component: RegistGroup,
  },
  {
    path: "/regist_food_booths",
    name: "RegistFoodBooths",
    component: RegistFoodBooths,
  },
  {
    path: "/regist_purchase",
    name: "RegistPurchase",
    component: RegistPurchase,
  },

  {
    path: "/firstcustomer",
    name: "Firstcustomer",
    component: Firstcustomer,
  },
  {
    path: "/password_reset",
    name: "PasswordReset",
    component: PasswordReset,
  },
  {
    path: "/edit_user_info",
    name: "EditUserInfo",
    component: EditUserInfo,
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
    path: "/mobile_user_detail",
    name: "MobileUserDetail",
    component: MobileUserDetail,
  },
  {
    path: "/mobile_group",
    name: "MobileGroup",
    component: MobileGroup,
  },
  {
    path: "/mobile_sub_rep",
    name: "MobileSubRep",
    component: MobileSubRep,
  },
  {
    path: "/mobile_firstcustomer",
    name: "MobileFirstCustomer",
    component: MobileFirstCustomer,
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
  {
    path: "/mobile_regist_group",
    name: "MobileRegistGroup",
    component: MobileRegistGroup,
  },
  {
    path: "/mobile_regist_shop",
    name: "MobileRegistShop",
    component: MobileRegistShop,
  },
  {
    path: "/mobile_place",
    name: "MobilePlace",
    component: MobilePlace,
  },
  {
    path: "/profile",
    name: "Profile",
    component: Profile,
  },
  {
    path: "/mobile_edit_user_info",
    name: "MobileEditUserInfo",
    component: MobileEditUserInfo,
  },
];

const router = new VueRouter({
  mode: "history",
  // base: process.env.BASE_URL,
  // base: process.env.VUE_APP_URL,
  routes,
  scrollBehavior(to, from, savedPosition) {
    console.log(to);
    console.log(from);
    console.log(savedPosition);
    return { x: 0, y: 0 };
  },
});

export default router;
