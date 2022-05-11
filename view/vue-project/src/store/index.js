import Vue from "vue";
import Vuex from "vuex";
// import Vuex, { Store } from "vuex";
// import current_user from "./modules/current_user";
import createPersistedState from "vuex-persistedstate";

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    registRepPermission: false, // ユーザー登録
    myPagePermission: false, // マイページ
    registGroupPermission: false, // 参加団体登録
    registSubRepPermission: false, // 副代表登録
    registRentalOrderPermission: false, // 物品登録
    registPowerOrderPermission: false, // 電力登録
    registPlaceOrderPermission: false, // 会場登録
    registStageOrderPermission: false, // ステージ登録
    registStageCommonOptionPermission: false, // ステージオプション登録
    registFoodProductPermission: false, // 販売食品登録
    registPurchaseListPermission: false, // 購入食品登録
    registEmployeePermission: false, // 従業員登録
  },
  mutations: {
    // ユーザー登録画面 
    acceptRegistRepPermission(state) {
      state.registRepPermission = true
    },
    rejectRegistRepPermission(state) {
      state.registRepPermission = false
    },
    
    // マイページ
    acceptMypagePermission(state) {
      state.myPagePermission = true
    },
    rejectMypagePermission(state) {
      state.myPagePermission = false
    },

    // 参加団体登録画面
    acceptRegistGroupPermission(state) {
      state.registGroupPermission = true
    },
    rejectRegistGroupPermission(state) {
      state.registGroupPermission = false
    },

    // 副代表登録画面
    acceptRegistSubRepPermission(state) {
      state.registSubRepPermission = true
    },
    rejectRegistSubRepPermission(state) {
      state.registSubRepPermission = false
    },

    // 物品登録画面
    acceptRegistRentalOrderPermission(state) {
      state.registRentalOrderPermission = true
    },
    rejectRegistRentalOrderPermission(state) {
      state.registRentalOrderPermission = false
    },
    
    // 電力登録画面
    acceptRegistPowerOrderPermission(state) {
      state.registPowerOrderPermission = true
    },
    rejectRegistPowerOrderPermission(state) {
      state.registPowerOrderPermission = false
    },

    // 会場登録画面
    acceptRegistPlaceOrderPermission(state) {
      state.registPlaceOrderPermission = true
    },
    rejectRegistPlaceOrderPermission(state) {
      state.registPlaceOrderPermission = false
    },

    // ステージ登録画面
    acceptRegistStageOrderPermission(state) {
      state.registStageOrderPermission = true
    },
    rejectRegistStageOrderPermission(state) {
      state.registStageOrderPermission = false
    },

    // ステージオプション登録画面
    acceptRegistStageCommonOptionPermission(state) {
      state.registStageCommonOptionPermission = true
    },
    rejectRegistStageCommonOptionPermission(state) {
      state.registStageCommonOptionPermission = false
    },
    
    rejectAllPermission(state) {
      state.registRepPermission = false
      state.registGroupPermission = false // 参加団体登録
      state.registSubRepPermission = false // 副代表登録
      state.registRentalOrderPermission = false // 物品登録
      state.registPowerOrderPermission = false // 電力登録
      state.registPlaceOrderPermission = false // 会場登録
      state.registStageOrderPermission = false // ステージ登録
      state.registStageCommonOptionPermission = false // ステージオプション登録
      state.registFoodProductPermission = false // 販売食品登録
      state.registPurchaseListPermission = false // 購入食品登録
      state.registEmployeePermission = false // 従業員登録
    }
  },
  getters: {
    getCount: state => {
      return state.count
    }
  },
  plugins: [createPersistedState()],
})

export default store
// export default new Vuex.Store({
//   modules: {
//     current_user,
//   },
//   state: {},
//   mutations: {},
//   actions: {},
// });
