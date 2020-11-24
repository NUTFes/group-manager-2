<template>
  <div>
      <Header/>

      <!-- Sizes your content based upon application components -->
        <News/>

        <Regist/>
  </div>
</template>

<script>
import Header from '../components/Header.vue'
import News from '../components/News.vue'
import Regist from '../components/Regist.vue'
import axios from 'axios'
export default {
  components: {
    Header, 
    News,
    Regist,
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
