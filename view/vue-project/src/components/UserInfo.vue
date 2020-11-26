<template>
  <v-row>
    <v-col cols="2"></v-col>
    <v-col cols="8">
      <v-card
        class = "mx-auto"
        color = "white"
        height = "250"
        flat
      >
      <v-row>
        <v-col>
          <v-card-title><h1 style="color:black">{{ user.name }}  様</h1></v-card-title>  
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-card-text>
            <h3>技大祭に参加していただき誠にありがとうございます。<br>登録情報の確認や変更が行えます。<br>入力締め切りはお守りいただくよう、よろしくお願いします。</h3>
          </v-card-text>
        </v-col>
      </v-row>
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
        user: []
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
          this.user = response.data.data
        })
    },
  }
</script>

