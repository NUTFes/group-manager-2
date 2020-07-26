<template>
  <div>
    <h1>My Page</h1>
    {{ users }}
    {{ data }}
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
