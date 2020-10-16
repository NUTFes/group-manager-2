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
      >
      <v-list-item>
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
          link
          >
          <v-list-item-icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
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
        { title: 'マイページ', icon: 'mdi-account-circle' },
        { title: 'ユーザー一覧', icon: 'mdi-account-multiple' },
        { title: '参加団体一覧', icon: 'mdi-account-group' },
        { title: '企画名一覧', icon: 'mdi-unfold-more-vertical ' },
        { title: '貸し出し物品一覧', icon: 'mdi-database' },
        { title: '物品申請一覧', icon: 'mdi-cube' },
        { title: '電力申請一覧', icon: 'mdi-flash' },
        { title: 'ステージ申請一覧', icon: 'mdi-map-marker-radius' },
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
