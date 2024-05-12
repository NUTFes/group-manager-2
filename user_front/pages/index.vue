<script lang="ts" setup>
import axios from "axios";

const router = useRouter();
const config = useRuntimeConfig();

definePageMeta({
  layout: false,
});

const email = ref("");
const password = ref("");
const login = () => {
  const params = new URLSearchParams({
    email: email.value,
    password: password.value,
  });
  axios.defaults.headers.common["Content-Type"] = "application/json";
  axios
    .post(config.APIURL + "/api/auth/sign_in", params)
    .then((response) => {
      localStorage.setItem("access-token", response.headers["access-token"]);
      localStorage.setItem("client", response.headers["client"]);
      localStorage.setItem("uid", response.headers["uid"]);
      localStorage.setItem("token-type", response.headers["token-type"]);
      router.push("/mypage");
    })
    .catch(() => {
      alert(
        "ログインに失敗しました。メールアドレスとパスワードを確認してください。\nLogin failed. Please check your email address and password."
      );
    });
};

const signUp = () => {
  router.push("/regist/user");
};
</script>

<template>
  <div>
    <Header />
    <div class="flex justify-center items-center relative bg-[#D83333] p-8">
      <div class="text-2xl md:text-5xl font-serif font-bold absolute">
        {{ $t("Welcome.welcome") }}
      </div>
      <img class="w-1/2 sm:w-1/3" src="../assets/43rd_logo.svg" />
    </div>
    <div class="flex justify-center items-center w-full sm:w-3/5 sm:mx-auto">
      <div
        class="shadow-md backdrop-blur border border-gray-300 rounded-md w-full p-8 sm:p-16 -translate-y-8 sm:-translate-y-16 flex flex-col items-center gap-8"
      >
        <div class="flex flex-col gap-8 w-4/5">
          <input
            type="email"
            placeholder="メールアドレス:mail"
            class="w-full bg-white border border-black rounded-md h-10 p-4 m-0"
            v-model="email"
          />
          <input
            type="password"
            placeholder="パスワード:password"
            class="w-full bg-white border border-black rounded-md h-10 p-4 m-0"
            v-model="password"
          />
        </div>
        <button
          class="h-10 w-48 mx-auto bg-white border border-[#00afcc] text-[#00afcc] rounded-lg hover:bg-[#00afcc] hover:text-white transition-all"
          @click="login"
        >
          {{ $t("Welcome.logIn") }}
        </button>
        <div class="w-4/5 flex flex-col items-center">
          <hr class="w-full" />
          <p class="-translate-y-1/2 p-4 bg-white h-fit">
            {{ $t("Welcome.toSignUp") }}
          </p>
          <button
            class="h-10 w-48 hover:bg-white border hover:border-[#00afcc] hover:text-[#00afcc] rounded-lg bg-[#00afcc] text-white transition-all"
            @click="signUp"
          >
            {{ $t("Welcome.signUp") }}
          </button>
        </div>
      </div>
    </div>
    <WelcomeDetail />
    <Footer />
  </div>
</template>
