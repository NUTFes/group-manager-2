import Vue from "vue";
import VueRouter from "vue-router";
import Welcome from "../views/Welcome.vue";
import MyPage from "../views/Mypage.vue";
import UserDetail from "../views/UserDetail.vue";
import Group from "../views/Group.vue";

import RegistEdit from "../views/RegistEdit.vue";
import RegistInformation from "../views/RegistInformation.vue";
import RegistRep from "../views/RegistRep.vue";
import RegistSubRep from "../views/RegistSubRep.vue";
import RegistGroupModel from "../views/RegistGroupModel.vue";
import RegistPlace from "../views/RegistPlace.vue";
import RegistPower from "../views/RegistPower.vue";
import RegistStage from "../views/RegistStage.vue";
import RegistRentalOrder from "../views/RegistRentalOrder.vue";
import RegistEmployees from "../views/RegistEmployees.vue";
import RegistPurchaseList from "../views/RegistPurchaseList.vue";
import RegistFoodProduct from "../views/RegistFoodProduct.vue";
import RegistStageOption from "../views/RegistStageOption.vue";

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
    path: "/registEdit",
    name: "RegistEdit",
    component: RegistEdit,
  },
  {
    path: "/regist_information",
    name: "RegistInformation",
    component: RegistInformation,
  },
  {
    path: "/regist_rep",
    name: "RegistRep",
    component: RegistRep,
  },
  {
    path: "/regist_subrep",
    name: "RegistSubRep",
    component: RegistSubRep,
  },
  {
    path: "/regist_model",
    name: "RegistGroupModel",
    component: RegistGroupModel,
  },
  {
    path: "/regist_place",
    name: "RegistPlace",
    component: RegistPlace,
  },
  {
    path: "/regist_power",
    name: "RegistPower",
    component: RegistPower,
  },
  {
    path: "/regist_stage",
    name: "RegistStage",
    component: RegistStage,
  },
  {
    path: "/regist_rentalOrder",
    name: "RegistRentalOrder",
    component: RegistRentalOrder,
  },
  {
    path: "/regist_Employees",
    name: "RegistEmployees",
    component: RegistEmployees,
  },
  {
    path: "/regist_purchaseList",
    name: "RegistPurchaseList",
    component: RegistPurchaseList,
  },
  {
    path: "/regist_foodProduct",
    name: "RegistFoodProduct",
    component: RegistFoodProduct,
  },
  {
    path: "/regist_stageOption",
    name: "RegistStageOption",
    component: RegistStageOption,
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
