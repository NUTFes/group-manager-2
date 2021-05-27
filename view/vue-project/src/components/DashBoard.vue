<template>
	<v-row>
    <v-col>
      <v-card elevation="0" color="#ECEFF1">
        <v-row align="center">
          <v-col>
            <v-card-text class="font-weight-bold subtitle-1">
            <h2>{{ user.name }}  様</h2>
            <v-divider class="my-3"/>
            技大祭に参加していただき誠に<br>ありがとうございます。<br>登録情報の確認や変更が行えます。<br>入力締め切りはお守りいただくよう、<br>よろしくお願いします。
            </v-card-text>
          </v-col> 
        </v-row>
      </v-card>
    </v-col>
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
