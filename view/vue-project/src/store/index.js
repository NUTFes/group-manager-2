import Vue from "vue";
import Vuex from "vuex";
// import Vuex, { Store } from "vuex";
// import current_user from "./modules/current_user";
// import createPersistedState from "vuex-persistedstate";

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    myPagePermission: true,
    registGroupPermission: false
  },
  mutations: {
    increment(state) {
      state.count ++
    },
    acceptMypagePermission(state) {
      state.myPagePermission = true
    },
    rejectMypagePermission(state) {
      state.myPagePermission = false
    }
  },
  getters: {
    getCount: state => {
      return state.count
    }
  }
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
