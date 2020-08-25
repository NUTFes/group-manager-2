import axios from 'axios'

export default {
  namespaced: true,
  state: {
    uid: '',
    accesstoken: '',
    client: ''
  },
  getters: {
    getUid: state => state.uid,
    getAccesstoken: state => state.accesstoken,
    getClient: state => state.client
  },
  mutations: {
    create (state, data) {
      state.uid = data.uid;
      state.accesstoken = data.accesstoken;
      state.client = data.client;
    }
  },
  actions: {

    async request ({dispatch, rootState}, {method, url, data}) {
      const headers = {}
      headers['Content-Type'] = 'application/json'
      if (rootState.users.accesstoken) {
        headers['access-token'] = `Accesstoken ${rootState.users.accesstoken}`
        headers['client'] = rootState.users.client
        headers['uid'] = rootState.users.uid
      }

      const options = {
        method,
        url: `${process.env.VUE_APP_URL}${url}`,
        headers,
        data,
        timeout: 15000
      }

      return axios(options)
        .then(res => res)
        .catch(err => {
          console.log(err)
        })
    },
    async post({dispatch}, requests){
      requests.method = 'post'
      return dispatch('request', requests)
    },

    create ({ commit, dispatch}, data){
      dispatch(
        'post',
        {url: '/api/auth', data},
        {root: true}
      ).then(res => commit('create', res.data))
        .catch(err => err)
    }
  },
}