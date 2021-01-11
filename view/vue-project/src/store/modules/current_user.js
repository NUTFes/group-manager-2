import axios from "axios";

const apiUrlBase = process.env.VUE_APP_URL + '/api/v1/current_user/show'

const headers = {
  "Content-Type": "multipart/form-data"
};

const state = {
  posts: []
};

const getters = {
  posts: state => state.posts.sort((a, b) => b.id - a.id)
};

const mutations = {
  setPosts: (state, posts) => (state.posts = posts),
  appendPost: (state, post) => (state.posts = [...state.posts, post]),
  removePost: (state, id) =>
    (state.posts = state.posts.filter(post => post.id !== id))
};

const actions = {
  async fetchPosts({ commit }) {
    try {
      const response = await axios.get(`${apiUrlBase}`);
      commit("setPosts", response.data);
    } catch (e) {
      console.error(e);
    }
  },
  async createPost({ commit }, post) {
    try {
      const response = await axios.post(`${apiUrlBase}`, post, headers);
      commit("appendPost", response.data);
    } catch (e) {
      console.error(e);
    }
  },
  async deletePost({ commit }, id) {
    try {
      axios.delete(`${apiUrlBase}/${id}`);
      commit("removePost", id);
    } catch (e) {
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
