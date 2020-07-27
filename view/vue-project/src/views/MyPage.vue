<template>
  <div>
    <h1>My Page</h1>
    {{ users }}
    {{ data }}
    <div class="text-center">
      <v-btn rounded color="#033" dark @click="signOut">Sign Out</v-btn>
    </div>

  </div>
</template>

<script>
import axios from 'axios'
export default {
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
      axios.delete('http://localhost/api/auth/sign_out', {
        headers: { 
          "Content-Type": "application/json", 
          "access-token": localStorage.getItem('access-token'),
          "client": localStorage.getItem('client'),
          "uid": localStorage.getItem('uid')
        }
      }).then(
        this.$router.push('/')
        localStorage.removeItem('access-token')
        localStorage.removeItem('client')
        localStorage.removeItem('uid')
        )
    }
  },
  mounted() {
    const url = 'http://localhost/api/v1/users/show'
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
