<template>
  <div>
    <v-row>
    <v-app-bar app dark dense color="#424242">
        <v-toolbar-title>Group-Manager Admin</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn text to="/mypage" color="#424242">
          <v-icon color="white">mdi-account-circle</v-icon>
          <v-card-text style="color:white">{{ user.name }}</v-card-text>
        </v-btn>
    </v-app-bar>
    </v-row>
  </div>
</template>

<script>
import axios from 'axios' 
import Menu from '../components/Menu.vue'
export default {
  components: {
    Menu,
  },
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
