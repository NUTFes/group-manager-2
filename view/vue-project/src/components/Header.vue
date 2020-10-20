<template>
  <v-app-bar
    app
    color = "grey darken-1"
    height = "90"
    >
    <v-row align="center">
      <v-col cols="2"></v-col>
      <v-col cols="2"><v-btn text class = "title white--text" to="/mypage">参加団体管理アプリ</v-btn></v-col>
      <v-col cols="4" align="center">
        <router-link to="/">
          <v-img 
                     height="70"
                     width ="70"
                     src = "../assets/40th_nutfes_logo_white.png"
                     ></v-img>
        </router-link>
      </v-col>
      <v-col cols="2" align="right">
        <v-chip
          color="white"
          label
          link
          outlined
          >
          {{ users.name }}
        </v-chip>
      </v-col>
      <v-col cols="2"></v-col>
    </v-row>
      </v-app-bar>
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
          this.users = response.data.data
        })
    }
  }
</script>
