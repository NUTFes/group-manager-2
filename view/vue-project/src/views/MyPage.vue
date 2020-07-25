<template>
  <div>
    <h1>My Page</h1>
    {{ users }}
  </div>
</template>

<script>
import axios from 'axios'
export default {
  data () {
    return {
      users: []
    }
  },
  mounted() {
    const url = 'http://localhost/api/v1/users/index'
    axios.defaults.headers.common['Content-Type'] = 'application/json'
    axios.defaults.headers.common['access-token'] = localStorage.getItem('access-token')
    axios.defaults.headers.common['client'] = localStorage.getItem('client')
    axios.defaults.headers.common['uid'] = localStorage.getItem('uid')
    axios.get(url)
      .then(response => {
        this.users = response
      })
  }
}
</script>
