import Vue from 'vue'
import App from './App.vue'
import Welcome from '../src/views/Welcome.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify';

Vue.config.productionTip = false

new Vue({
  router,
  store,
  vuetify,
  // render: h => h(App)
  render: h => h(Welcome)
}).$mount('#app')
