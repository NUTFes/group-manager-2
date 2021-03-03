<template>
  <div>
    <v-row>
      <v-col>
        <div class="signup-card">
          <v-card class="mt-5 mx-auto " max-width="600" flat>
            <v-form ref="form" v-model="valid" lazy-validation>
                <v-row justify="center" style="padding-top:5%; padding-bottom:5%">
                  <p cols="12" class="mt-3 display-1">
                  新規登録
                  </p>
                </v-row>
                <v-row>
                  <v-col cols=1></v-col>
                  <v-col cols=10>
                    <v-text-field
                      v-model="name"
                      label="フルネーム"
                      outlined
                      clearable
                      />
                      <p class="caption mb-0" />
                    <v-text-field
                      v-model="email"
                      label="Eメールアドレス"
                      outlined
                      clearable
                      />
                      <p class="caption mb-0" />
                    <v-text-field
                      outlined
                      clearable
                      v-model="password"
                      type="password"
                      label="パスワード"
                      />
                    <v-text-field
                      outlined
                      clearable
                      v-model="password_confirmation"
                      type="password"
                      label="パスワード確認"
                      />
                  </v-col>
                  <v-col cols=1></v-col>
                </v-row>
                <v-row justify="center" style="padding-bottom:5%">
                  <v-col cols="12" md="10" sm="10">
                    <v-btn
                      flat
                      block
                      large
                      class="mr-4 blue white--text"
                      @click="signup"
                      >
                      新規登録
                    </v-btn>
                      <br>
                      <v-btn
                        block
                        outlined 
                        large
                        href="/"
                        >
                        ログインはこちら
                      </v-btn>
                  </v-col>
                </v-row>
            </v-form>
          </v-card>
        </div>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  data () {
    return {
      password: '',
      password_confirmation: '',
      email: '',
      name: ''
    }
  },
  methods: {
    signup() {
      var params = new URLSearchParams();
      params.append('name', this.name);
      params.append('email', this.email);
      params.append('role_id', 2); // デフォルトはmanager権限
      params.append('password', this.password);
      params.append('password_confirmation', this.password_confirmation);
      this.$axios.defaults.headers.common['Content-Type'] = 'application/json';
      this.$axios.post('/api/auth', params).then(
        (response) => {
          localStorage.setItem('access-token', response.headers['access-token'])
          localStorage.setItem('client', response.headers['client'])
          localStorage.setItem('uid', response.headers['uid'])
          localStorage.setItem('token-type', response.headers['token-type'])
          this.$router.push('regist_user_detail')
        }
      )
    }
  }
}
</script>

<style scoped>
.signup-card {
  padding-top: 5%;
  padding-left: 20%;
}
</style>
