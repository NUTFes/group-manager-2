import Vue from 'vue'
import Vuex from 'vuex'
import current_user from './modules/current_user'
import createPersistedState from "vuex-persistedstate"

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    current_user
  },
  state: {
  },
  mutations: {
  },
  actions: {
  },
})
