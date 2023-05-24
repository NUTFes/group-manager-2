<script lang="ts" setup>
import axios from "axios";
import { loginCheck } from "@/utils/methods";

definePageMeta({
  layout: false,
});

const router = useRouter();
const config = useRuntimeConfig();

const password = ref("");
const password_confirmation = ref("");

const submit = () => {
  const url = config.APIURL + "/api/v1/current_user/password_reset";
  axios
    .post(
      url,
      {
        password: password.value,
        password_confirmation: password_confirmation.value,
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
      (response) =>{
        alert('登録できました')
        router.push("/mypage");
      },
      (error) => {
        alert('登録できませんでした')
      }
    )
}

onMounted(async () => {
  loginCheck();
});
</script>

<template>
  <Header />
  <div class="regist-card">
    <NuxtLink to="/mypage" class="regist-back-link">{{
      $t("Mypage.goToMypage")
    }}</NuxtLink>
    <div class="reist-title-content">
      <div class="user-info">{{ $t("User.resetPassword") }}</div>
    </div>
    <div>
      <input
        type="password"
        :placeholder="$t('User.newPassword')"
        v-model="password"
      />
      <input
        type="password"
        :placeholder="$t('User.newPasswordConfirm')"
        v-model="password_confirmation"
      />
    </div>
    <div class="regist-button">
      <button class="regist-submit-button" @click="submit">
        {{ $t("Button.register") }}
      </button>
    </div>
  </div>
</template>

<style scoped>
.regist-card {
  @apply w-[1000px]
    mx-auto;
}

.reist-title-content {
  @apply flex
    flex-col
    justify-center
    items-center;
}

.regist-back-link {
  @apply block
    text-lg
    text-[#e040fb]
    cursor-pointer
    w-fit
    mt-5;
}

.regist-back-link:hover {
  @apply font-bold
    text-[#e040fb];
}

.user-info {
  @apply text-3xl
    font-bold
    mb-6;
  padding: 1% 1% 1% 2%;
}

.regist-card input, .regist-card select {
  @apply text-left
    p-[1%]
    h-[50px]
    w-[1000px]
    mb-5
    rounded-[7px]
    text-lg
    align-top;
}

.regist-card input:required, .regist-card select {
  border: 1px solid red;
}

.regist-card input:invalid, .regist-card select {
  border: 1px solid red;
}

.regist-card input:valid, .regist-card select {
  border: 1px solid #333333;
}

.regist-button {
  @apply text-right
    mb-8;
}

.regist-submit-button {
  @apply text-xl
    text-[#333333]
    bg-[#eceff1]
    font-bold
    rounded-[5px]
    mt-[2%]
    py-[1%]
    px-[5%]
    cursor-pointer;
}
.regist-submit-button:hover {
  @apply text-[#333333];
  background-image: linear-gradient(
    90deg,
    rgba(247, 93, 139, 1),
    rgba(254, 220, 64, 1)
  );
}
.regist-submit-button:active {
  @apply text-[#333333];
  box-shadow: inset 1px 1px 2px #babecc, inset -1px -1px 2px #fff;
}
</style>
