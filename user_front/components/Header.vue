<script lang="ts" setup>
import axios from "axios";

definePageMeta({
  layout: false,
});

const router = useRouter()
const route = useRoute();
const config = useRuntimeConfig()

const logout = () => {
  axios.delete(config.APIURL+"/api/auth/sign_out", {
    headers: {
      "Content-Type": "application/json",
      "access-token": localStorage.getItem("access-token"),
      "client": localStorage.getItem("client"),
      "uid": localStorage.getItem("uid"),
    },
  }).then( () => {
    localStorage.clear()
    router.push("/")
  },
);
}
</script>

<template>
  <div class="header">
    <div class="header-content">
      <button class="header-title">技大祭2023</button>
      <button v-if="route.path != '/'" class ="header-back" @click="logout">ログアウト</button>
    </div>
  </div>
</template>

<style>
  .header{
    border-bottom: solid 1px #d3d3d3;
    @apply
      fixed
      top-0
      left-0
      flex
      bg-white
      z-10
      sticky
      py-4
      w-full
      justify-center;
  }

  .header-content {
    @apply
      flex
      w-[1000px]
      mx-auto;
  }

  .header-title {
    @apply
      font-bold
      decoration-gray-300
      text-2xl
      text-start;
  }

  .header-back {
    @apply
      decoration-gray-300
      text-2xl
      ml-auto;
  }
</style>
