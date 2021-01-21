<template>
  <div>
    <v-app-bar app dark dense color="#424242">
      <v-col cols="10">
        <v-toolbar-title>Group-Manager Admin</v-toolbar-title>
      </v-col>
      <v-col cols="2">
        <v-btn depressed href="/mypage" color="#424242">
          <v-icon>mdi-account-circle</v-icon>
          <v-card-text>{{ user.name }}</v-card-text>
        </v-btn>
      </v-col>
    </v-app-bar>
  </div>
</template>

<script>
import axios from 'axios' 

export default {
  data () {
    return {
      drawer: true,
      items: [
        { title: 'マイページ', icon: 'mdi-account-circle', click: '/mypage'},
      ],
      user: []
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
    }
    )
      .then(response => {
        this.user = response.data.data
      })
  }
}
</script>