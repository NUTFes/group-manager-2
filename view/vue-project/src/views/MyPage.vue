<template>
  <div>
      <Header/>

      <v-navigation-drawer 
        app
        right
        temporary
        v-model="drawer"
      >
        <UserNav/>
      </v-navigation-drawer>

      <!-- Sizes your content based upon application components -->
      <v-main>
        <News/>

        <Regist/>
      </v-main>
  </div>
</template>

<script>
import Header from '../components/Header.vue'
import UserNav from '../components/UserNav.vue'
import News from '../components/News.vue'
import Regist from '../components/Regist.vue'
import axios from 'axios'
export default {
  components: {
    Header, 
    News,
    Regist,
    UserNav,
　},
  data () {
    return {
      data: [
        localStorage.getItem('access-token'),
        localStorage.getItem('client'),
        localStorage.getItem('uid')
      ],
      users: []
    }
  },
  methods: {
    signOut: function() {
      const url = process.env.VUE_APP_URL + '/api/auth/sign_out'
      axios.delete(url, {
        headers: { 
          "Content-Type": "application/json", 
          "access-token": localStorage.getItem('access-token'),
          "client": localStorage.getItem('client'),
          "uid": localStorage.getItem('uid')
        }
      }).then(
        this.$router.push('/'),
        localStorage.removeItem('access-token'),
        localStorage.removeItem('client'),
        localStorage.removeItem('uid')
        )
    }
  },
  mounted() {
    const url = process.env.VUE_APP_URL + '/api/v1/users/show'
    axios.get(url, {
      headers: { 
        "Content-Type": "application/json", 
        "access-token": localStorage.getItem('access-token'),
        "client": localStorage.getItem('client'),
        "uid": localStorage.getItem('uid')
      }
    }
    )
      .then(response => {
        this.users = response
      })
  }
}
</script>
