<template>
  <div>
    <v-app-bar
      app
      color = "grey darken-1"
      height = "90"
      dark
    >
      <v-row align="center">
      <v-col cols="2"></v-col>
      <v-col cols="2"><v-btn text depressed class="title ma-2" to="/">参加団体管理アプリ</v-btn></v-col>
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
          @click.stop="drawer = !drawer"
        >
          {{ users.name }}
        </v-chip>
      </v-col>
      <v-col cols="2"></v-col>
    </v-row>
    </v-app-bar>

    <v-navigation-drawer
      v-model="drawer"
      right
      app
      temporary
      color="grey darken-1"
    >
    <v-list-item-avatar>
      <v-icon>mdi-account-circle-outline</v-icon>
      </v-list-item-avatar>

     <v-list-item-content>
      <v-list-item-title>{{ users.name }}</v-list-item-title>
     </v-list-item-content>
    
     <v-divider></v-divider>

     </v-list>
  
      <v-list-item dark @click="signOut">
        <v-list-item-content>
          <v-list-item-title>ログアウト</v-list-item-title>
        </v-list-item-content>
      </v-list-item>

    </v-navigation-drawer>
  </div>    
</template>

<script>
  import axios from 'axios'
  export default {
    data () {
    return {
      drawer: null,
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
    },
		methods: {
    	signOut: function() {
      axios.delete('http://localhost/api/auth/sign_out', {
        headers: { 
          "Content-Type": "application/json", 
          "access-token": localStorage.getItem('access-token'),
          "client": localStorage.getItem('client'),
          "uid": localStorage.getItem('uid')
        }
      }).then(
        this.$router.push('/'),
        localStorage.removeItem('access-token'),
        localStorage.removeItem('client'),
        localStorage.removeItem('uid')
        )
    	}
  	}
  }
</script>
