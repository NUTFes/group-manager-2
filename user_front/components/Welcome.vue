<script lang="ts" setup>
//   let email = "";
//   let password = "";
//   const signup = () => {
//   }
//   const submit = () => {
//
//submit: function () {
//       const url = process.env.VUE_APP_URL + "/api/auth/sign_in";
//       let params = new URLSearchParams();
//       params.append("email", this.email);
//       params.append("password", this.password);
//       axios.defaults.headers.common["Content-Type"] = "application/json";
//       axios.post(url, params).then(
//         (response) => {
//           localStorage.setItem(
//             "access-token",
//             response.headers["access-token"]
//           );
//           localStorage.setItem("client", response.headers["client"]);
//           localStorage.setItem("uid", response.headers["uid"]);
//           localStorage.setItem("token-type", response.headers["token-type"]);
//           // Mypageへのアクセスを許可する
//           this.$store.commit("acceptMypagePermission");
//           this.$router.push("mypage");
//         },
//         (error) => {
//           this.message = "ログインに失敗しました。(Failed to SignIn)";
//           return error;
//         }
//       );

const config = useRuntimeConfig()
const email = "nutfes-taro@email.com"
const password = "password"

// const params = {
//   email: "nutfes-taro@email.com",
//   password: "password",
//   methods: "POST",
//   headers: {
//     "Content-Type": "application/json",
//   },
// }
const submit = await fetch(config.baseURL + "/api/auth/sign_in",{
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    email: email,
    password: password,
  }),
});



// import WelcomeDetailStep from "@/components/WelcomeDetail-step.vue";
// import axios from "axios";
// import isMobile from "ismobilejs";
// export default {
//   name: "Welcome",
//   components: {
//     WelcomeDetailStep,
//   },
//   data() {
//     return {
//       isMobile: isMobile,
//       show: true,
//       isStep: 1,
//       windowWidth: window.innerWidth,
//       email: "",
//       password: "",
//       formHasErrors: false,
//       rules: {
//         requied: (value) => !!value || "入力してください",
//         min: (v) => v.length >= 8 || "８文字未満です",
//         email: (v) => {
//           const pattern =
//             /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
//           return pattern.test(v) || "適切なメールアドレスではありません。";
//         },
//       },
//       message: "",
//     };
//   },
//   mounted() {
//     // Mypageへのアクセス許可があればMypageに飛ばす
//     if (this.$store.state.myPagePermission) {
//       this.$router.push("/mypage");
//     }
//     window.addEventListener("resize", this.calculateWindowWidth);
//   },
//   beforeDestroy() {
//     window.removeEventListener("resize", this.calculateWindowWidth);
//   },
//   computed: {
//   },
//   methods: {
//     signup: function() {
//       this.$store.commit("acceptRegistRepPermission");
//       this.$router.push("/regist_rep");
//     },
//     submit: function () {
//       const url = process.env.VUE_APP_URL + "/api/auth/sign_in";
//       let params = new URLSearchParams();
//       params.append("email", this.email);
//       params.append("password", this.password);
//       axios.defaults.headers.common["Content-Type"] = "application/json";
//       axios.post(url, params).then(
//         (response) => {
//           localStorage.setItem(
//             "access-token",
//             response.headers["access-token"]
//           );
//           localStorage.setItem("client", response.headers["client"]);
//           localStorage.setItem("uid", response.headers["uid"]);
//           localStorage.setItem("token-type", response.headers["token-type"]);
//           // Mypageへのアクセスを許可する
//           this.$store.commit("acceptMypagePermission");
//           this.$router.push("mypage");
//         },
//         (error) => {
//           this.message = "ログインに失敗しました。(Failed to SignIn)";
//           return error;
//         }
//       );
//     },
//     toggle_show() {
//       this.show = !this.show;
//     },
//     change() {
//       if (this.isStep == 1) {
//         this.isStep = 2;
//       } else if (this.isStep == 2) {
//         this.isStep = 1;
//       }
//     },
//     calculateWindowWidth() {
//       this.windowWidth = window.innerWidth;
//     },
//   },
// };
</script>

<template>
  <div>
    <div class="welcome-top">
      <div class="welcome-banner">
        <div class="welcome-banner-message">ようこそ技大祭へ</div>
        <img class="w-96 h-64" src="../assets/following-step01.svg"/>
      </div>
    </div>
    <div class="welcome-login-content">
      <div class="welcome-login-content-form">
        <div class="login-form">
          <input type="email" placeholder="メールアドレス" class="login-input" v-model="email" />
        </div>
        <div class="login-form">
          <input type="password" placeholder="パスワード" class="login-input" v-model="password" />
        </div>
        <div class="login-form-button">
          <button class="login-button" @click="submit">ログイン</button>
        </div>
        <button class="signup-button" @click="signup">新規登録はこちら</button>
      </div>
    </div>
  </div>
</template>

<style>
  .welcome-top{
    background-color: #00AFCC;
    @apply
      flex
      justify-center
      h-[400px]
      text-center
      relative;
  }
  /* .welcome-banner {
    @apply
      text-center
      relative;
  } */
  .welcome-banner-message{
    font-size: 5vw;
    font-family:serif;
    font-weight: bold;
    @apply
      absolute
      w-full
      top-1/2
      right-1/2
      translate-x-1/2;
  }
  .welcome-login-content {
    @apply
      block
      relative
      w-[1000px]
      h-auto
      mx-auto;
  }
  .welcome-login-content-form {
    box-shadow: 0 4px 10px rgb(149 157 165 / 20%);
    background: radial-gradient(
      ellipse at top left,
      rgba(251, 251, 251, 0.9),
      rgba(251, 251, 251, 0.8)
    );
    backdrop-filter: blur(5px);
    @apply
      absolute
      h-[400px]
      p-[60px]
      w-full
      max-w-[1100px]
      min-w-[750px]
      rounded-[10px]
      -mt-[60px]
      text-center;
  }
  .login-form {
    @apply
      text-center
      w-3/5
      mb-5
      ml-auto
      mr-auto;
  }
  .login-input {
    border: solid 1px #000000;
    background-color: #ffffff;
    @apply
      w-[95%]
      h-10
      p-[2%]
      rounded-[5px];
  }
  .login-button {
    border: solid 1px #00AFCC;
    color: #00AFCC;
    background-color: #ffffff;
    @apply
      mt-2.5
      rounded-[10px]
      h-10
      w-2/5
      mx-auto;
  }
  .signup-button {
    background-color: #00AFCC;
    color: #ffffff;
    border: solid 1px #00AFCC;
    font-size: 28px;
    @apply
      mt-5
      rounded-[10px]
      h-[60px]
      w-2/5
      mx-auto;
  }
</style>
