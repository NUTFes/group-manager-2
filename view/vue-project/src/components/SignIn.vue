 <template>
  <v-row justify="center">
    <v-dialog v-model="show" max-width="600px" dark>
      <v-card>
        <v-card-title>
          <span class="headline">ログイン</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-form  ref="test_form">
              <v-text-field
                label="メールアドレス"
                v-model="email"
                :rules="[rules.requied]"
                required
              ></v-text-field>
              <v-text-field
                label="パスワード"
                v-model="password"
                :append-icon="show_pass ? 'mdi-eye' : 'mdi-eye-off'"
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
          <v-btn color="blue darken-1" text @click="show = false">キャンセル</v-btn>
          <v-btn color="blue darken-1" @click="signIn">ログイン</v-btn>
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
      rules: {
        requied: value => !!value || 'Required.',
        min: v => v.length >= 8 || 'Min 8 characters',
      },
    }
  },
  methods: {
    open () {
      this.show = true
    },
    signIn: function() {
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

