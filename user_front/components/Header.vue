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
    localStorage.removeItem("access-token"),
    localStorage.removeItem("client"),
    localStorage.removeItem("uid"),
    localStorage.removeItem("group_id"),
    localStorage.removeItem("group_category_id"),
    localStorage.removeItem("token-type"),
    router.push("/")
  },
);
}
</script>

<template>
  <div class="header">
    <div class="header-content">
      <button class="header-title">{{ $t('Header.header') }}</button>
      <form class="flex items-center w-40">
        <label for="locale-select">{{ $t('language') }}： </label>
        <select class="w-auto m-auto ml-0 h-auto border-none" id="locale-select" v-model="$i18n.locale">
          <option value="ja">日本語</option>
          <option value="en">English</option>
        </select>
      </form>
      <button v-if="route.path != '/'" class ="header-back" @click="logout">{{ $t('Header.logOut') }}</button>
    </div>
  </div>
</template>

<style>
  .header{
    border-bottom: solid 1px #d3d3d3;
    @apply
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
      gap-5
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
