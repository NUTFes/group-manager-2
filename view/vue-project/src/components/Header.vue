<template>
      <v-app-bar
        color = "grey darken-1"
        height = "90"
      >
      <v-row align="center">
        <v-col cols="3"  class = "title white--text">参加団体管理アプリ</v-col>
        <v-col cols="6" align="center">
          <v-img 
          height="70"
          width ="70"
          src = "../assets/40th_nutfes_logo_white.png"
        ></v-img>
        </v-col>
        <v-col cols="3" align="right">
          <v-chip
            color="white"
            label
            link
            outlined
          >
            {{ users.name }}
          </v-chip>
        </v-col>
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