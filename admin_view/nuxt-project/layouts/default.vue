<template>
  <v-app :style="{ background: $vuetify.theme.themes.light.background }">
    <Menu v-if="main && print" />
    <Header v-if="main && print" />
    <v-main>
      <transition mode='in-out'>
        <nuxt />
      </transition>
    </v-main>
  </v-app>
</template>
<script>
import Header from '~/components/Header.vue'
import Menu from '~/components/Menu.vue'
export default {
  components: {
    Header,
    Menu,
  },
  data() {
    return {
      flag:false,
      user:[], 
      content:[], 
      memos: [],
      users:[]
    }
  },
  computed:{
    main(){
      return this.$route.path !== '/' && this.$route.path !== '/signup' && this.$route.path !== '/regist_user_detail'
    },
    print(){
      return this.$route.path !== '/print/employees' && this.$route.path !== '/print/products' && this.$route.path !== '/print/items' && this.$route.path !== '/print/powers' && this.$route.path !== '/print/address'
    }
  },
  mounted() {
    this.$axios.get('api/v1/users/show', {
      headers: { 
        "Content-Type": "application/json", 
        "access-token": localStorage.getItem('access-token'),
        "client": localStorage.getItem('client'),
        "uid": localStorage.getItem('uid')
      }
    }).then(response => {
        this.user = response.data.data
      })

    this.$axios.get('/memos', {
      headers: { 
        "Content-Type": "application/json", 
      }
    }).then(response => {
        this.memos = response.data
      })
  },
  methods: {
    submit: function() {
      this.$axios.defaults.headers.common['Content-Type'] = 'application/json';
      var params = new URLSearchParams();
      params.append('content', this.content);
      params.append('user_id', this.user.id);
      this.$axios.post('/memos', params).then(
        (response) => {
          this.memos = response.data
          this.content = []
        },
        (error) => {
          return error
        }
        )
    },
    destroy: function(id) {
      this.$axios.defaults.headers.common['Content-Type'] = 'application/json';
      var params = new URLSearchParams();
      this.$axios.delete(`/memos/#{id}`, params).then(
        (response) => {
          this.memos = response.data
        },
        (error) => {
          return error
        }
        )
    },
  }
}
</script>

<style lang="scss">
.pad-bottom {
  padding-bottom: 150px;
}
.v-enter {
  transform: scale(0.9);
  opacity: 0.1;
}
.v-enter-to {
  opacity: 1;
}
.v-enter-active {
  transition: all 0.6s .1s ease;
}
.v-leave {
  transform: scale(0.1) translate(0%,100%);
  opacity: 1;
}
.v-leave-to {
  transform: scale(0.1) translate(0%,100%);
  opacity: 0;
}
.v-leave-active {
  transition: all 5s 0s ease;
}
// テーブルの奇数行をつける
.v-data-table tr {
    background: #E0F2F1;
}
.v-data-table tr:nth-child(odd) {
    background: #fff;
}
.v-data-table tr:hover {
    background-color: #eee;
}
.v-application a {
  color: #FFF;
}
.breadcrumbs {
  text-align: center;
}
.breadcrumbs ul {
  list-style: none;
  display: flex;
}
.breadcrumbs ul li {
  display: inline;
}	
.breadcrumbs ul li .breadcrumbs-item {
  display: block;
  position: relative;
  height: 30px;
  background: #999;
  text-align: center;
  padding: 5px 10px 5px 24px;
  margin: 0 7px 0 0; 
  font-size: 0.8125rem;
  text-decoration: none;
  color: #fff;
}
.breadcrumbs ul li .breadcrumbs-item:before {
  content: "";  
  border-top: 15px solid transparent;
  border-bottom: 15px solid transparent;
  border-left: 15px solid #EEE;
  position: absolute; left: 0; top: 0;
}
.breadcrumbs ul li .breadcrumbs-item:after {
  content: "";  
  border-top: 15px solid transparent;
  border-bottom: 15px solid transparent;
  border-left: 15px solid #999;
  position: absolute; right: -15px; top: 0;
  z-index: 1;
}
.breadcrumbs ul li:first-child .breadcrumbs-item {
  border-top-left-radius: 5px;
  border-bottom-left-radius: 5px;
}
.breadcrumbs ul li:first-child .breadcrumbs-item:before {
  display: none; 
}
.breadcrumbs ul li:last-child .breadcrumbs-item {
  border-top-right-radius: 5px;
  border-bottom-right-radius: 5px;
  background: var(--v-accent-base);
}
.breadcrumbs ul li:last-child .breadcrumbs-item:after {
  display: none; 
}
.back-button {
  border-radius: 100vh;
  display: block;
  position: relative;
  height: 27px;
  background: #999;
  text-align: center;
  padding: 5px 10px;
  font-size: 0.8125rem;
  text-decoration: none;
}
.card {
  padding-right: 5%
}
.sticky-note {
  width: max-content;
  height: max-content;
  margin-bottom: 1em;
  overflow: hidden;
  box-shadow: .25rem 0 .25rem hsla(0, 0%, 0%, .1);
  background-image:
    linear-gradient(90deg, hsla(0, 0%, 45%, .1) 2rem, hsla(0, 100%, 100%, 0) 2.5rem)
  , linear-gradient(90deg, hsla(60, 100%, 85%, 1), hsla(60, 100%, 85%, 1));
  line-height: 1.8;
}

.sticky-note hr {
  border: none;
}

.sticky-note__item {
  padding: 0 .25em 0 3em;
}

.sticky-note__date {
  text-align: right;
  padding-right: .5em;
}
</style>
