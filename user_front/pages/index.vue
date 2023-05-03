<script lang="ts" setup>
import axios from "axios";

const router = useRouter()
const config = useRuntimeConfig()

definePageMeta({
  layout: false,
});

const email = ref("")
const password = ref("")
const login = () => {
  const params = new URLSearchParams({
    email: email.value,
    password: password.value,
  })
  axios.defaults.headers.common["Content-Type"] = "application/json";
  axios.post(config.APIURL+"/api/auth/sign_in", params).then(
    (response) => {
      localStorage.setItem(
        "access-token",
        response.headers["access-token"]
      );
    localStorage.setItem("client", response.headers["client"]);
    localStorage.setItem("uid", response.headers["uid"]);
    localStorage.setItem("token-type", response.headers["token-type"]);
    router.push("/mypage")
  },);
}

const signUp = () =>{
  router.push("/regist/user")
}
</script>

<template>
  <div>
    <Header/>
    <div class="welcome-top">
      <div class="welcome-banner">
        <div class="welcome-banner-message">ようこそ技大祭へ</div>
        <img class="w-[800px] h-[400px]" src="../assets/following-step01.svg"/>
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
          <button class="login-button" @click="login">ログイン</button>
        </div>
        <button class="signup-button" @click="signUp">新規登録はこちら</button>
      </div>
    </div>
    <WelcomeDetail />
    <Footer />
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
      translate-x-1/2
      -translate-y-1/2;
  }
  .welcome-login-content {
    @apply
      block
      relative
      w-[1000px]
      h-[360px]
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
  .login-button:hover {
    background-color: #00AFCC;
    border: solid 1px #00AFCC;
    color: #ffffff
  }
  .login-button:active {
    background-color: #00AFCC;
    border: solid 1px #00AFCC;
    color: #ffffff
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
  .signup-button:hover {
    opacity: 0.5;
  }
</style>
