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
    registStageOrderSunnyPermission: false, // ステージ登録(晴れ)
    registStageOrderRainyPermission: false, // ステージ登録(雨)
    registStageCommonOptionPermission: false, // ステージオプション登録
    registFoodProductPermission: false, // 販売食品登録
    registPurchaseListPermission: false, // 購入食品登録
    registEmployeePermission: false, // 従業員登録
    registEditPermission: false, // まとめて編集ページ

    completePermission: false, // 確認画面
    userInfoPermission: false, // ユーザー情報画面
    editUserInfoPermission: false, // ユーザー情報確認画面
    resetPasswordPermission: false, // パスワード変更ページ

    // ステージの晴れ/雨の分岐用のパラメータ
    // 1: マイページから新規登録で両方登録してない場合）晴れ → 雨 → マイページ
    // 2: マイページから新規登録で両方登録してない場合）雨 → 晴れ → マイページ
    // 3: マイページから新規登録で片方だけ登録していない場合) 晴れ → マイページ
    // 4: マイページから新規登録で片方だけ登録してない場合) 雨 → マイページ
    // 5: 新規登録の場合) 晴れ → 雨 → ステージオプション
    typeStage: 0,
    // マイページから飛んだか新規登録からか
    fromMypage: false
  },
  mutations: {
    typeStage1(state) {
      state.typeStage = 1
    },
    typeStage2(state) {
      state.typeStage = 2
    },
    typeStage3(state) {
      state.typeStage = 3
    },
    typeStage4(state) {
      state.typeStage = 4
    },
    typeStage5(state) {
      state.typeStage = 5
    },
    onFromMypage(state) {
      state.fromMypage = true
    },
    offFromMypage(state) {
      state.fromMypage = false
    },
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

    // ステージ登録画面（晴れ)
    acceptRegistStageOrderSunnyPermission(state) {
      state.registStageOrderSunnyPermission = true
    },
    rejectRegistStageOrderSunnyPermission(state) {
      state.registStageOrderSunnyPermission = false
    },

    // ステージ登録画面(雨)
    acceptRegistStageOrderRainyPermission(state) {
      state.registStageOrderRainyPermission = true
    },
    rejectRegistStageOrderRainyPermission(state) {
      state.registStageOrderRainyPermission = false
    },

    // ステージオプション登録画面
    acceptRegistStageCommonOptionPermission(state) {
      state.registStageCommonOptionPermission = true
    },
    rejectRegistStageCommonOptionPermission(state) {
      state.registStageCommonOptionPermission = false
    },

    // まとめて編集画面
    acceptRegistEditPermission(state) {
      state.registEditPermission = true
    },
    rejectRegistEditPermission(state) {
      state.registEditPermission = false
    },

    // 確認画面
    acceptCompletePermission(state) {
      state.completePermission = true
    },
    rejectCompletePermission(state) {
      state.completePermission = false
    },

    // ユーザー情報
    acceptUserInfoPermission(state) {
      state.userInfoPermission = true
    },
    rejectUserInfoPermission(state) {
      state.userInfoPermission = false
    },

    // ユーザー情報編集
    acceptEditUserInfoPermission(state) {
      state.editUserInfoPermission = true
    },
    rejectEditUserInfoPermission(state) {
      state.editUserInfoPermission = false
    },

    // パスワードリセット
    acceptResetPasswordPermission(state) {
      state.resetPasswordPermission = true
    },
    rejectResetPasswordPermission(state) {
      state.resetPasswordPermission = false
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
      state.userInfoPermission = false
      state.editUserInfoPermission = false
      state.resetPasswordPermission = false
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
