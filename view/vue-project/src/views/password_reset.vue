<template>
  <v-row justify="center">
    <v-col cols="2"></v-col>
    <v-col cols="8">
      <v-card flat>
        <v-container class="justify-content-center">
          <v-row>
            <v-col cols="2"></v-col>
            <v-col cols="8" align="center">
              <v-card-title class="justify-center">
                <h1 style="color:#333333">パスワード再設定</h1>
              </v-card-title>
                <br>
                <v-divider></v-divider>
                <br>
              <v-card-text>
                <v-form ref="form">
                  <v-text-field
                    label="パスワード"
                    ref="password"
                    outlined
                    v-model="password"
                    :append-icon="show_pass ? 'mdi-eye-off' : 'mdi-eye'"
                    :rules="[rules.requied, rules.min]"
                    :type="show_pass ? 'password' : 'text'"
                    hint="8文字以上"
                    counter
                    @click:append="show_pass = !show_pass"
                    required
                  ></v-text-field>
                  <v-text-field
                    label="パスワードの再入力"
                    outlined
                    ref="password_confirmation"
                    v-model="password_confirmation"
                    :append-icon="show_pass_confirmation ? 'mdi-eye-off' : 'mdi-eye'"
                    :rules="[rules.requied, rules.min, rules.match]"
                    :type="show_pass_confirmation ? 'password' : 'text'"
                    hint="8文字以上"
                    counter
                    @click:append="show_pass_confirmation = !show_pass_confirmation"
                    required
                  ></v-text-field>
                </v-form>
              </v-card-text>
              <v-card-action>
                <v-btn color="btn" rounded depressed dark block @click="submit">変更登録</v-btn>
                <v-btn color="btn" text block rounded to="/mypage">マイページに戻る</v-btn>
              </v-card-action>
            </v-col>
            <v-col cols="2"></v-col>
          </v-row>
        </v-container>
      </v-card>
    </v-col>
    <v-col cols="2"></v-col>
  </v-row>
</template>

<script>

import axios from 'axios'
export default {
  data () {
    return {
      show_pass: true,
      show_pass_confirmation: true,
      rules: {
        requied: value => !!value || '入力してください',
        min: v => v.length >= 8 || '８文字未満です',
        match: v => v === this.password || 'パスワードと再確認パスワードが一致していません',
      },
      message: '',
      warnStyle: {
        color: '#F44336'
      },
      password: null,
      password_confirmation: null
    }
  },
  computed: {
  },
  methods: {
    cancel: function() {
      this.$refs.form.reset();
    },
    submit: function() {
      if ( !this.$refs.form.validate() ) return;

      const url = process.env.VUE_APP_URL + '/api/v1/current_user/password_reset'

      axios.post(url, {
          'password' : this.password,
          'password_confirmation' : this.password_confirmation
        }, {
          headers: {
            'Content-Type': 'application/json',
            'access-token': localStorage.getItem('access-token'),
            'client': localStorage.getItem('client'),
            'uid': localStorage.getItem('uid')
          }
        }
      ).then(
        (response) => {
          console.log('response:', response)
          this.$router.push('MyPage')
        },
        (error) => {
          console.log('登録できませんでした')
          return error;
        }
      )
    },
  },
  mounted() {
  },
}

</script>
