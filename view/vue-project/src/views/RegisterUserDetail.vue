<template>
  <div>
    <h1>ユーザーの詳細を登録</h1>
    <p>{{ user }}</p>
    <template>
      <v-form>
        <v-container>
          <v-text-field
            label="TEL"
            single-line
            v-model="tel"
            ></v-text-field>
        </v-container>
      </v-form>
      <div class="my-2">
        <v-btn large color="primary">Primary</v-btn>
      </div>
    </template>
  </div>
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
      user: [],
  }
  },
  methods: {
    open () {
      this.show = true
    },
    signIn: function() {
      const url = process.env.VUE_APP_URL + '/api/auth/sign_in'
      var params = new URLSearchParams();
      params.append('tel', this.tel);
      params.append('department_id', this.department_id);
      params.append('grade_id', this.grade_id);
      axios.defaults.headers.common['Content-Type'] = 'application/json';
      axios.post(url, params).then(
        (response) => {
          this.$router.push('MyPage')
        },
        (error) => {
          return error
        }
        )
      this.show = false
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
        this.user = response
      })
  }
}
</script>

