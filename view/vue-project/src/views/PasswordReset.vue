<template>
  <div>
    <router-link to="/mypage" style="text-decoration: none"><span class="regist-back-link">マイページに戻る</span></router-link>
    <h1 style="color: #333333; padding-bottom: 50px">パスワード再設定</h1>
      <v-form ref="form">
        <v-text-field
          label="新しいパスワードを入力"
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
        />
        <v-text-field
          label="新しいパスワードの再入力"
          outlined
          ref="password_confirmation"
          v-model="password_confirmation"
          :append-icon="
            show_pass_confirmation ? 'mdi-eye-off' : 'mdi-eye'
          "
          :rules="[rules.requied, rules.min, rules.match]"
          :type="show_pass_confirmation ? 'password' : 'text'"
          hint="8文字以上"
          counter
          @click:append="
            show_pass_confirmation = !show_pass_confirmation
          "
          required
        />
      </v-form>
      <div class="regist-button">
        <button class="regist-submit-button" @click="submit">登録</button>
      </div>
  </div>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      show_pass: true,
      show_pass_confirmation: true,
      rules: {
        requied: (value) => !!value || "入力してください",
        min: (v) => v.length >= 8 || "８文字未満です",
        match: (v) =>
          v === this.password ||
          "パスワードと再確認パスワードが一致していません",
      },
      message: "",
      warnStyle: {
        color: "#F44336",
      },
      password: null,
      password_confirmation: null,
    };
  },
  computed: {},
  methods: {
    cancel: function () {
      this.$refs.form.reset();
    },
    submit: function () {
      if (!this.$refs.form.validate()) return;

      const url =
        process.env.VUE_APP_URL + "/api/v1/current_user/password_reset";

      axios
        .post(
          url,
          {
            password: this.password,
            password_confirmation: this.password_confirmation,
          },
          {
            headers: {
              "Content-Type": "application/json",
              "access-token": localStorage.getItem("access-token"),
              client: localStorage.getItem("client"),
              uid: localStorage.getItem("uid"),
            },
          }
        )
        .then(
          (response) => {
            console.log("response:", response);
            this.$router.push("MyPage");
          },
          (error) => {
            console.log("登録できませんでした");
            return error;
          }
        );
    },
  },
  mounted() {},
};
</script>
