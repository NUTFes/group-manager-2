<template>
	<v-row>
    <v-col cols="2"></v-col>
    <v-col cols="8">
      <v-card elevation="0" color="#ECEFF1">
        <v-row align="center">
          <v-col cols=9>
            <v-card-text class="font-weight-bold display-1">
              {{ user.name }} 
            </v-card-text>
            <v-card-text class="font-weight-bold subtitle-1">
              {{ user.email }}
            </v-card-text>
          </v-col> 
          <v-col cols=3> 
            <v-list-item link to="/group" class="justify-end">初めての方へ</v-list-item>
            <v-list-item link to="/group" class="justify-end">参加団体管理アプリとは</v-list-item>
            <v-list-item link to="/group" class="justify-end">よくあるご質問</v-list-item>
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
