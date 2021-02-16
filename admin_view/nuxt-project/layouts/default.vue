<template>
  <v-app dark :style="{ background: $vuetify.theme.themes.light.background }">
    <Header v-if="main"/>
      <div class="pad-bottom">
        <v-row>
          <v-col cols="2" v-if="main && print">
            <Menu/>
          </v-col>
          <v-col cols="10">
            <v-main>
              <transition mode='out-in'>
              <nuxt />
              </transition>
            </v-main>
          </v-col>
        </v-row>
      </div>
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
      return this.$route.path !== '/' && this.$route.path !== '/signup' && this.$route.path !== '/regist_user_detail' && this.$route.path !== '/users/print'
    },
    print(){
      return this.$route.path !== '/users/print'
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
  transform: translate(0, 0, 100px);
  opacity: 0;
}
.v-enter-to {
  opacity: 1;
}
.v-enter-active {
  transition: all 2s .3s ease;
}
.v-leave {
  transform: translate(0, 0);
  opacity: 1;
}
.v-leave-to {
  transform: translate(0, 0, 100px);
  opacity: 0;
}
.v-leave-active {
  transition: all .5s 0s ease;
}
</style>
