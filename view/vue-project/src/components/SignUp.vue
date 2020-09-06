 <template>
  <v-row justify="center">
    <v-dialog v-model="show" max-width="600px" dark>
      <v-card>
        <v-card-title>
          <span class="headline">Sign Up</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-form ref="form">
              <v-text-field
                label="Name"
                ref="name"
                v-model="name"
                :rules="[rules.requied]"
                required
              ></v-text-field>
              <v-text-field
                label="Email"
                ref="email"
                v-model="email"
                :rules="[rules.requied]"
                required
              ></v-text-field>
              <v-text-field
                label="Password"
                ref="password"
                v-model="password"
                :append-icon="show_pass ? 'mdi-eye' : 'mdi-eye-off'"
                :rules="[rules.requied, rules.min]"
                :type="show_pass ? 'password' : 'text'"
                hint="8 characters"
                counter
                @click:append="show_pass = !show_pass"
                required
              ></v-text-field>
              <v-text-field
                label="Password Confirmation"
                ref="password_confirmation"
                v-model="password_confirmation"
                :append-icon="show_pass_confirmation ? 'mdi-eye' : 'mdi-eye-off'"
                :rules="[rules.requied, rules.min, rules.match]"
                :type="show_pass_confirmation ? 'password' : 'text'"
                hint="8 characters"
                counter
                @click:append="show_pass_confirmation = !show_pass_confirmation"
                required
              ></v-text-field>
            </v-form>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="cancel">Close</v-btn>
          <v-btn color="blue darken-1" text @click="submit">Sign Up</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
import axios from 'axios'
export default {
  name: 'SignUp',
  data () {
    return {
      show: false,
      show_pass: true,
      show_pass_confirmation: true,
      formHasErrors: false,
      rules: {
        requied: value => !!value || 'Required.',
        min: v => v.length >= 8 || 'Min 8 characters',
        match: v => v === this.password || 'chigau yo~',
      },
    }
  },
  computed: {
    form () {
      return {
        name: null,
        email: null,
        password: null,
        password_confirmation: null,
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
      if (!this.formHasErrors) return 'Can`t Sign Up'

      const url = process.env.VUE_APP_URL + '/api/auth'
      var params = new URLSearchParams();
      params.append('name', this.name);
      params.append('email', this.email);
      params.append('role_id', 3); // デフォルトはuser権限
      params.append('password', this.password);
      params.append('password_confirmation', this.password_confirmation);
      axios.defaults.headers.common['Content-Type'] = 'application/json';
      axios.post(url, params).then(
        (response) => {
          localStorage.setItem('access-token', response.headers['access-token'])
          localStorage.setItem('client', response.headers['client'])
          localStorage.setItem('uid', response.headers['uid'])
          localStorage.setItem('token-type', response.headers['token-type'])
          this.$router.push('MyPage')
        }
      )
    }
  }
}
</script>
