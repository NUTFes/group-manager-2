import axios from "axios"

const apiUrlBase = 'api/v1/users/show'

const headers = {
  "Content-Type": "application/json", 
};

const state = {
  currentUserRole: []
};

const getters = {
  currentUserRole: state => state.currentUserRole
}

const mutations = {
  getCurrentUserRole: (state, currentUserRole) => (state.currentUserRole = currentUserRole)
}

const actions = {
  async getCurrentUserRoleAction({ commit }) {
    try {
      const response = await axios.get(`${apiUrlBase}`);
      commit("getCurrentUserRole", response.data.data.user.role_id)
    }
    catch (e) {
      console.error(e);
    }
  }
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
};

