<template>
  <div>
    <v-app-bar
      app
      >
      <v-container>
        <v-row>
          <v-col cols="1"></v-col>
          <v-col cols="1">
            <v-btn
              dark
              color="black"
              text
              @click.stop="drawer = !drawer"
              >
              <v-icon dark>mdi-format-list-bulleted</v-icon>
            </v-btn>
          </v-col>
          <v-col cols="6">
            <v-toolbar-title>参加団体管理アプリ管理者画面</v-toolbar-title>
          </v-col>
          <v-spacer></v-spacer>
          <v-col cols="2"></v-col>
        </v-row>
      </v-container>
    </v-app-bar>
    <v-navigation-drawer
      v-model="drawer"
      absolute
      temporary
      color="#37474F"
      >
      <v-list-item dark>
        <v-list-item-avatar>
          <v-icon>mdi-account-circle-outline</v-icon>
        </v-list-item-avatar>

        <v-list-item-content>
          <v-list-item-title>{{ user.name }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <v-divider></v-divider>

      <v-list dense>

        <v-list-item
          v-for="item in items"
          :key="item.title"
          :to="item.click"
          color="#A9B6BD"
          dark
          >
          <v-list-item-icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>

      <v-list-item dark @click="logout">
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
      items: [
        { title: 'マイページ', icon: 'mdi-account-circle', click: '/mypage'},
        { title: 'ユーザー一覧', icon: 'mdi-account-multiple', click: '/groups' },
        { title: '参加団体一覧', icon: 'mdi-account-group', click: '/groups' },
        { title: '企画名一覧', icon: 'mdi-unfold-more-vertical', click: '/groups' },
        { title: '貸し出し物品一覧', icon: 'mdi-database', click: '/groups' },
        { title: '物品申請一覧', icon: 'mdi-cube', click: '/groups' },
        { title: '電力申請一覧', icon: 'mdi-flash', click: '/groups' },
        { title: 'ステージ申請一覧', icon: 'mdi-map-marker-radius', click: '/groups' },
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
  },
  methods: {
    logout() {
      this.$auth.logout()
    }
  }
}
</script>
