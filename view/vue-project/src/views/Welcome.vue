<template>
  <div>
    <div style="margin-top: 60px">
      <div class="welcome-top">
        <div class="welcome-banner">
          <span class="welcome-banner-message">ようこそ技大祭へ</span>
          <div class="welcome-banner-img"></div>
          <img src="../assets/uniform.svg" width="800px" height="400px" style="margin-top: 10px">
        </div>
      </div>
      <div class="welcome-login">
        <div class="welcome-login-content">
          <div class="welcome-login-content-form">
            <div class="login-form">
              <input type="email" placeholder="メールアドレス" class="login-input" v-model="email">
            </div>
            <div class="login-form">
              <input type="password" placeholder="パスワード" class="login-input" v-model="password">
            </div>
            <p style="color: red">{{ message }}</p>
            <div class="login-form-button">
              <button class="login-button" @click="submit">ログイン</button>
            </div>
            <button class="signup-button">新規登録はこちら</button>
          </div>
        </div>
      </div>
    </div>
    <WelcomeDetailStep style="margin-top: 360px;" />
  </div>
</template>

<script>
import WelcomeDetailStep from "@/components/WelcomeDetail-step.vue";
import axios from "axios";
export default {
  name: "Welcome",
  components: {
    WelcomeDetailStep,
  },
  data() {
    return {
      show: true,
      isStep: 1,
      windowWidth: window.innerWidth,
      email: "",
      password: "",
      formHasErrors: false,
      rules: {
        requied: (value) => !!value || "入力してください",
        min: (v) => v.length >= 8 || "８文字未満です",
        email: (v) => {
          const pattern =
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
          return pattern.test(v) || "適切なメールアドレスではありません。";
        },
      },
      message: "",
    };
  },
  mounted() {
    window.addEventListener("resize", this.calculateWindowWidth);
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.calculateWindowWidth);
  },
  computed: {
  },
  methods: {
    submit: function () {
      console.log("submit");
      const url = process.env.VUE_APP_URL + "/api/auth/sign_in";
      let params = new URLSearchParams();
      params.append("email", this.email);
      params.append("password", this.password);
      axios.defaults.headers.common["Content-Type"] = "application/json";
      axios.post(url, params).then(
        (response) => {
          localStorage.setItem(
            "access-token",
            response.headers["access-token"]
          );
          localStorage.setItem("client", response.headers["client"]);
          localStorage.setItem("uid", response.headers["uid"]);
          localStorage.setItem("token-type", response.headers["token-type"]);
          this.$router.push("mypage");
        },
        (error) => {
          this.message = "ログインに失敗しました。(Failed to SignIn)";
          return error;
        }
      );
    },
    toggle_show() {
      this.show = !this.show;
    },
    change() {
      if (this.isStep == 1) {
        this.isStep = 2;
      } else if (this.isStep == 2) {
        this.isStep = 1;
      }
    },
    calculateWindowWidth() {
      this.windowWidth = window.innerWidth;
      console.log(this.windowWidth);
    },
  },
};
</script>

<style>
.welcome-top {
  background-color: #00AFCC;
  height: 400px;
  width: 100%;
}
.welcome-banner {
  text-align: center;
  position: relative;
}
.welcome-banner-message {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 80px;
  font-family:serif;
  font-weight: bold;
}
.welcome-bannar-img {
  padding-top: 50px;
}
.welcome-login {
  display: block;
}
.welcome-login-content {
  position: relative;
  width: 1000px;
  margin-left: auto;
  margin-right: auto;
  height: auto;
}
.welcome-login-content-form {
  box-shadow: 0 4px 10px rgb(149 157 165 / 20%);
  background: radial-gradient(
    ellipse at top left,
    rgba(251, 251, 251, 0.9),
    rgba(251, 251, 251, 0.8)
  );
  backdrop-filter: blur(5px);
  position: absolute;
  height: 400px;
  padding: 60px;
  max-width: 1100px;
  min-width: 750px;
  width: 100%;
  border-radius: 10px;
  margin-top: -60px;
  text-align: center;

}
.login-form {
  text-align: center;
  width: 60%;
  margin-bottom: 20px;
  margin-left: auto;
  margin-right: auto;
}
.login-input {
  border: solid 1px #000000;
  background-color: #ffffff;
  border-radius: 5px;
  width: 95%;
  height: 40px;
  padding: 2%;
}
.login-form-label {
  text-align: left;
  height: 30px;;
}
.login-form-button {
  width: 100%;
}
.login-button {
  margin-top: 10px;
  border-radius: 10px;
  height: 40px;
  width: 40%;
  border: solid 1px #00AFCC;
  color: #00AFCC;
  background-color: #ffffff;
  margin-left: auto;
  margin-right: auto;
}
.login-button:hover {
  background-color: #00AFCC;
  border: solid 1px #00AFCC;
  color: #ffffff
}
.signup-button {
  background-color: #00AFCC;
  border-radius: 10px;
  margin-top: 20px;
  color: #ffffff;
  border: solid 1px #00AFCC;
  width: 40%;
  height: 60px;
  font-size: 28px;
}
.signup-button:hover {
  opacity: 0.5;
}
v-sheet {
  color: black;
}

.text-label {
  opacity: 0.5;
  text-align: center;
}

.background {
  background-image: url("~@/assets/hero-header-golden-ratio-logo.png");
  background-size: cover;
  min-height: 80vh;
  background-position: center center;
}

.text-label {
  font-size: 45px;
  text-align: center;
}

.card-color {
  background-color: rgba(255, 255, 255, 0.5) !important;
  border-color: white !important;
}
.logo {
  fill: #ffffff;
}
</style>
