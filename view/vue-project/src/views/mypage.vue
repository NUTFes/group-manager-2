<template>
  <div>
				<UserInfo/>
        <News/>
        <div
          v-for="(regist, i) in regist_info"
          :key="i"
          >
          <Regist
            :num="i"
            :regist="regist"
          />
        </div>
        <br>
        <div style="text-align:center">
          <v-tooltip top>
            <template v-slot:activator="{ on, attrs  }">
              <v-btn 
                class="mx-2" fab dark color="purple accent-2"
                dark
                v-bind="attrs"
                v-on="on"
                to="/group"
              >
                <v-icon dark>mdi-plus</v-icon>
              </v-btn>
            </template>
            <span>参加団体を追加する</span>
          </v-tooltip>
        </div>
        <br>
  </div>
</template>

<script>
import Header from '@/components/Header.vue'
import UserInfo from '@/components/UserInfo.vue'
import News from '@/components/News.vue'
import Regist from '@/components/Regist.vue'
import axios from 'axios'
export default {
  components: {
    UserInfo,
    Header, 
    News,
    Regist,
  },
  data () {
    return {
      data: [
        localStorage.getItem('access-token'),
        localStorage.getItem('client'),
        localStorage.getItem('uid')
      ],
      users: [],
      regist_info: []
    }
  },
  methods: {
    signOut: function() {
      const url = process.env.VUE_APP_URL + '/api/auth/sign_out'
      axios.delete(url, {
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
        this.users = response
      })
    const regist_info_url = process.env.VUE_APP_URL + '/api/v1/current_user/regist_info'
    axios.get(regist_info_url, {
      headers: { 
        "Content-Type": "application/json", 
        "access-token": localStorage.getItem('access-token'),
        "client": localStorage.getItem('client'),
        "uid": localStorage.getItem('uid')
      }
    }
    )
      .then(response => {
        this.regist_info = response.data
      })
  }
}
</script>
