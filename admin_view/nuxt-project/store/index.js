import Vue from "vue";
import Vuex from "vuex";
import getCurrentUserRole from './modules/getCurrentUserRole'
import createPersistedState from "vuex-persistedstate"

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    getCurrentUserRole 
  },
  state: {
  },
  mutations: {
  },
  actions: {
  },
})
