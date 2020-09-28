 <template>
  <v-row justify="center">
    <v-dialog v-model="show" max-width="600px" dark>
      <v-card>
        <v-card-title>
          <span class="headline">ログイン</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-form  ref="form">
              <v-text-field
                label="メールアドレス"
                ref="email"
                v-model="email"
                :rules="[rules.requied]"
                required
              ></v-text-field>
              <v-text-field
                label="パスワード"
                v-model="password"
                ref="password"
                :append-icon="show_pass ? 'mdi-eye-off' : 'mdi-eye'"
                :rules="[rules.required, rules.min]"
                :type="show_pass ? 'password' : 'text'"
                hint="8 characters"
                counter
                @click:append="show_pass = !show_pass"
                required
              ></v-text-field>
            </v-form>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="cancel">キャンセル</v-btn>
          <v-btn color="blue darken-1" @click="submit">ログイン</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
import axios from 'axios'
export default {
  name: 'SignIn',
  data () {
    return {
      show: false,
      show_pass: true,
      formHasErrors: false,
      rules: {
        requied: value => !!value || '入力してください',
        min: v => v.length >= 8 || '８文字未満です',
      },
    }
  },
  computed: {
    form () {
      return {
        email: null,
        password: null,
      }
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
          return error
        }
        )
      this.show = false
    }
  }
}
</script>

