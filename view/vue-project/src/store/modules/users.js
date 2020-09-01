import axios from 'axios'

const namespaced = true

const state = {
  uid: '',
  accesstoken: '',
  client: ''
}

const getters = {
  getUid: state => state.uid,
  getAccesstoken: state => state.accesstoken,
  getClient: state => state.client
}

const mutations = {
  create (state, data) {
    state.uid = data.uid;
    state.accesstoken = data.accesstoken;
    state.client = data.client;
  }
}

const actions = {

  async request ({dispatch, rootState}, {method, url, data}) {
    const headers = {}
    headers['Content-Type'] = 'application/json'
    if (rootState.users.accesstoken) {
      headers['access-token'] = `Accesstoken ${rootState.users.accesstoken}`
      headers['client'] = rootState.users.client
      headers['uid'] = rootState.users.uid
//      headers['X-CSRF-TOKEN'] = document.querySelector('meta[name="csrf-token"]').getAttribute('content')
    }

    const options = {
      method,
      url: `${process.env.VUE_APP_URL}${url}`,
      headers,
      data,
      timeout: 15000
    }

    console.log(data)
    console.log(headers)

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

  create ({dispatch, commit}, data){
    dispatch(
      //'post' or 'users/post'
      'users/post',
      {url: '/api/auth', data},
      {root: true}
    ).then(res => commit('create', res.data))
    .catch(err => err)
  }
}

export default {
  namespaced,
  state,
  mutations,
  actions,
  getters
}