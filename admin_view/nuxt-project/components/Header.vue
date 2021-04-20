<template>
  <div>
      <v-app-bar
        app
        clipped-left
        dark 
        dense 
        color="header"
      >
        <v-toolbar-title>
          <v-btn
            v-if="this.$route.path === '/dashboard'"
            text
          >
            参加団体管理アプリ-管理者ページ
          </v-btn>
          <v-btn
            v-else
            text 
            to="/dashboard"
          >
            参加団体管理アプリ-管理者ページ
          </v-btn>
        </v-toolbar-title>

        <v-spacer></v-spacer>

        <v-btn text color="#header" v-if="this.$route.path === '/dashboard'">
          <v-icon>mdi-account-circle</v-icon>
          <v-card-text style="color:white">{{ user.name }}</v-card-text>
        </v-btn>
        <v-btn text to="/dashboard" color="#header" v-else>
          <v-icon>mdi-account-circle</v-icon>
          <v-card-text style="color:white">{{ user.name }}</v-card-text>
        </v-btn>
        <v-btn text @click="logout" color="#header">
          <v-icon>mdi-exit-to-app</v-icon>
          <v-card-text style="color:white">ログアウト</v-card-text>
        </v-btn>
        <v-btn
          color="btn"
          dark
          @click="open"
          style="box-shadow:none"
          >
          <v-icon class="mr-2">mdi-note</v-icon>
          MEMO
        </v-btn> 
      </v-app-bar>
      <v-navigation-drawer
        v-model="drawer"
        fixed
        right
        temporary
        hide-overlay
        width="500"
        >
        <v-list-item>
          <v-list-item-content>
          <v-textarea
            label="メモ"
            v-model="content"
            text
            outlined
            required
            height="100"
            ></v-textarea>
          <v-btn v-if="this.content.length===0" outlined color="btn" block large dark>投稿</v-btn>
          <v-btn v-else color="btn" block large dark depressed @click="submit">投稿</v-btn>
          </v-list-item-content>
        </v-list-item>

        <v-divider></v-divider>
        <div class="text-center" v-if="memos.length === 0">
          <br><br>
          <v-progress-circular
            indeterminate
            color="#009688"
            ></v-progress-circular>
          <br><br>
        </div>

        <div v-else>
          <v-list>
            <v-list-item
              dense
              v-for="item in memos"
              :key="item.id"
              >
              <v-list-item-content class="sticky-note">
                <v-list-title class="sticky-note__item">{{ item.user }}</v-list-title>
                <v-list-title class="sticky-note__item">{{ item.memo.content }}</v-list-title>
                <br>
                <br>
                <v-list-title class="sticky-note__date">{{ item.memo.created_at | format-date}}</v-list-title>
                <v-divider/>
              </v-list-item-content>

            </v-list-item>
          </v-list>
        </div>
      </v-navigation-drawer>
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
      drawer: false,
      user: [],
      content:[], 
      memos: [],
      users:[]
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
    open: function() {
      this.$axios.get('/memos', {
        headers: { 
          "Content-Type": "application/json", 
        }
      }).then(response => {
          this.memos = response.data
        })
      this.drawer = true
    },
    submit: function() {
      this.$axios.defaults.headers.common['Content-Type'] = 'application/json';
      var params = new URLSearchParams();
      params.append('content', this.content);
      params.append('user_id', this.user.id);
      this.$axios.post('/memos', params).then(
        (response) => {
          this.memos = response.data
          this.content = ''
        },
        (error) => {
          return error
        }
        )
    },
    logout() {
      this.$auth.logout()
      localStorage.removeItem('access-token')
      localStorage.removeItem('client')
      localStorage.removeItem('uid')
      this.$router.push('/')
    }
  }
}
</script>
