 <template>
    <v-row justify="center">
      <v-col cols="1"></v-col>
      <v-col cols="10">
        <v-card flat class="py-5">
          <v-card-title class="headline font-weight-bold">
            ログイン
          </v-card-title>
          <v-card-text>
            <v-container>
              <v-form  ref="form">
                <v-text-field
                  label="メールアドレス"
                  ref="email"
                  v-model="email"
                  :rules="[rules.requied, rules.email]"
                  required
                ></v-text-field>
                <v-text-field
                  label="パスワード"
                  v-model="password"
                  ref="password"
                  :append-icon="show_pass ? 'mdi-eye-off' : 'mdi-eye'"
                  :rules="[rules.required, rules.min]"
                  :type="show_pass ? 'password' : 'text'"
                  hint="8文字以上"
                  counter
                  @click:append="show_pass = !show_pass"
                  required
                ></v-text-field>
              </v-form>
            </v-container>
          </v-card-text>
            <v-card-actions>
              <v-btn 
                color="btn" 
                text  
                dark 
                rounded
                tabindex="-1"
                class="ml-2"
                @click="cancel">パスワードを忘れた場合</v-btn>
              <v-btn 
                color="btn" 
                depressed
                absolute
                right 
                dark 
                rounded
                class="pl-4 font-weight-bold"
                @click="submit">ログイン<v-icon class="ml-n1">mdi-menu-right</v-icon></v-btn>
            </v-card-actions>
       </v-card>
      </v-col>
      <v-col cols="1"></v-col>
    </v-row>
</template>

<script>
import axios from 'axios'
import colors from 'vuetify/lib/util/colors'
export default {
  name: 'SignIn',
  data () {
    return {
      show_pass: true,
      formHasErrors: false,
      rules: {
        requied: value => !!value || '入力してください',
        min: v => v.length >= 8 || '８文字未満です',
        email: v => {
          const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
          return pattern.test(v) || '適切なメールアドレスではありません。'
        }
      },
      message: '',
      warnStyle: {
        color: '#F44336'
      }
    }
  },
  computed: {
    form () {
      return {
        email: null,
        password: null,
      }
    },
    getMessage () {
      return this.message
    }
  },
  methods: {
    open: function() {
      this.show = true
    },
    cancel: function() {
      Object.keys(this.form).forEach(f => {
        this.$refs[f].reset()
      })
      this.show = false
    },
    submit: function() {
      this.formHasErrors = false

      Object.keys(this.form).forEach(f => {
        if (!this.form[f]) this.formHasErrors = true
        this.$refs[f].validate(true)
      })
      if (!this.formHasErrors) return 'Can`t Sing In'

      const url = process.env.VUE_APP_URL + '/api/auth/sign_in'
      var params = new URLSearchParams();
      params.append('email', this.email);
      params.append('password', this.password);
      axios.defaults.headers.common['Content-Type'] = 'application/json';
      axios.post(url, params).then(
        (response) => {
          localStorage.setItem('access-token', response.headers['access-token'])
          localStorage.setItem('client', response.headers['client'])
          localStorage.setItem('uid', response.headers['uid'])
          localStorage.setItem('token-type', response.headers['token-type'])
          this.$router.push('MyPage')
        },
        (error) => {
          this.message = 'ログインに失敗しました。<br>Failed to SignIn'
          return error
        }
      )},
  }
}

</script>

