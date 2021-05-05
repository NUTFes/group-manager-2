<template>
  <div class="signup-card">
    <v-container fill-height>
      <v-row 
        align="center" 
        justify="center" 
        :style="{ background: $vuetify.theme.themes.light.loginbg }"
      >
        <v-col>
          <v-form 
            ref="form" 
            v-model="valid" 
            lazy-validation
          >
            <v-row 
              justify="center" 
              style="padding-top:5%; padding-bottom:5%"
            >
              <p class="mt-3 display-1 font-weight-bold info--text">
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
                  depressed
                  dark
                  block
                  large
                  color = "btn"
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
                  color = "btn"
                >
                  ログインはこちら
                </v-btn>
              </v-col>
            </v-row>
          </v-form>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import axios from "axios";
export default {
  auth: false,
  data() {
    return {
      password: "",
      password_confirmation: "",
      email: "",
      name: "",
    };
  },
  methods: {
    signup() {
      var params = new URLSearchParams();
      params.append("name", this.name);
      params.append("email", this.email);
      params.append("role_id", 2); // デフォルトはmanager権限
      params.append("password", this.password);
      params.append("password_confirmation", this.password_confirmation);
      this.$axios.defaults.headers.common["Content-Type"] = "application/json";
      this.$axios.post("/api/auth", params).then((response) => {
        localStorage.setItem("access-token", response.headers["access-token"]);
        localStorage.setItem("client", response.headers["client"]);
        localStorage.setItem("uid", response.headers["uid"]);
        localStorage.setItem("token-type", response.headers["token-type"]);
        this.$router.push("regist_user_detail");
      });
    },
  },
};
</script>

<style>
.signup-card {
  padding-top: 2%;
  padding-left: 30%;
  padding-right: 30%;
  padding-bottom: 2%;
  height: 100%;
}
</style>
