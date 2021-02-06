<template>
  <div>
    <v-row>
      <v-app-bar app dark dense color="#424242">
        <v-toolbar-title>Group-Manager Admin</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn text to="/mypage" color="#424242">
          <v-icon color="white">mdi-account-circle</v-icon>
          <v-card-text style="color:white">{{ user.name }}</v-card-text>
        </v-btn>
        <v-btn
          color="pink"
          dark
          @click.stop="drawer = !drawer"
          style="box-shadow:none"
          >
          <v-icon class="mr-2">mdi-note</v-icon>
          MEMO
        </v-btn> 
      </v-app-bar>
      <v-navigation-drawer
        v-model="drawer"
        absolute
        right
        temporary
        hide-overlay
        width="500"
        >
        <v-list-item>
          <v-list-item-content>
          <v-text-field
            label="メモ"
            v-model="content"
            text
            outlined
            required
            height="100"
            ></v-text-field>
          <v-btn v-if="this.content.length===0" outlined color="blue darken-1" block large dark>投稿</v-btn>
          <v-btn v-else color="blue darken-1" block large dark @click="submit">投稿</v-btn>
          </v-list-item-content>
        </v-list-item>

        <v-divider></v-divider>

        <v-list>
          <v-list-item
            dense
            v-for="item in memos"
            :key="item.id"
            >
            <v-list-item-content>
              <v-list-title>{{ item.user_id }}</v-list-title>
              <v-list-title>{{ item.content }}</v-list-title>
              <br>
              <br>
              <v-list-title style="text-align:right">{{ item.created_at | format-date}}</v-list-title>
              <v-divider/>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-navigation-drawer>
    </v-row>
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
      drawer: true,
      items: [
        { title: 'マイページ', icon: 'mdi-account-circle', click: '/mypage'},
      ],
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

    this.$axios.get('/memos', {
      headers: { 
        "Content-Type": "application/json", 
      }
    }).then(response => {
        this.memos = response.data
      })
  },
  methods: {
    submit: function() {
      this.$axios.defaults.headers.common['Content-Type'] = 'application/json';
      var params = new URLSearchParams();
      params.append('content', this.content);
      params.append('user_id', this.user.id);
      this.$axios.post('/memos', params).then(
        (response) => {
          this.memos = response.data
          this.content = []
        },
        (error) => {
          return error
        }
        )
    },
    destroy: function(id) {
      this.$axios.defaults.headers.common['Content-Type'] = 'application/json';
      var params = new URLSearchParams();
      this.$axios.delete(`/memos/#{id}`, params).then(
        (response) => {
          this.memos = response.data
        },
        (error) => {
          return error
        }
        )
    },
  }
}
</script>
