<template>
  <v-row>
    <v-col cols="2"></v-col>
    <v-col cols="8">
      <v-card
        class = "mx-auto"
        color = "white"
        height = 500px
      >
      <v-row 
      align="center"
      justify="space-around"
      >
        <v-col cols = "2"><v-card-title class = "title font-weight-bold">登録情報</v-card-title></v-col>
        <v-col cols = "8"></v-col>
        <v-col cols = "2" align = "right">    
          <v-btn
            class="button font-weight-midium"
            text
            color="pink lighten-2"
          >
          ▶︎edit
          </v-btn>
        </v-col>
        </v-row>
        <v-divider class="mx-4"></v-divider>
        <v-list>
          <v-list-item>
          <v-list-item-content>
              <v-col cols="2">
              <v-list-item-title class = "font-weight-bold">団体名</v-list-item-title>
              </v-col>
              <v-col cols = "6">技大祭実行委員会</v-col>
            </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-content>
              <v-col cols="2">
              <v-list-item-title class = "font-weight-bold">代表者</v-list-item-title>
              </v-col>
              <v-col cols = "6">{{ users.name }}</v-col>
            </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-content>
              <v-col cols="2">
              <v-list-item-title class = "font-weight-bold">副代表者</v-list-item-title>
              </v-col>
              <v-col cols = "6">技大梅子</v-col>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-card>
    </v-col>
    <v-col cols="2"></v-col>
  </v-row>
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
