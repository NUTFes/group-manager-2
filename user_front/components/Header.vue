<script lang="ts" setup>
import axios from "axios";

definePageMeta({
  layout: false,
});

const router = useRouter();
const route = useRoute();
const config = useRuntimeConfig();
const isMenuOpen = ref(false);

const logout = () => {
  if(localStorage.getItem("client")==null){
    router.push("/");
  }
  axios
    .delete(config.APIURL + "/api/auth/sign_out", {
      headers: {
        "Content-Type": "application/json",
        "access-token": localStorage.getItem("access-token"),
        client: localStorage.getItem("client"),
        uid: localStorage.getItem("uid"),
      },
    })
    .then(() => {
      localStorage.clear();
      router.push("/");
    });
};

const backHome = () => {
  if(localStorage.getItem("client")==null){
    router.push("/");
  }else{
    router.push("/mypage");
  }
};

const localChageHandler = (e: any) => {
  localStorage.setItem("local", e.target.value);
}

</script>

<template>
  <div class="sticky top-0 bg-white z-50 w-full border-b border-gray-300">
    <div class="flex gap-8 p-2 md:py-4 md:px-8">
      <button class="font-bold text-2xl" @click="backHome">
        {{ $t("Header.header") }}
      </button>
      <form class="md:flex items-center w-fit hidden">
        <label class="whitespace-nowrap" for="locale-select"
          >{{ $t("language") }}：
        </label>
        <select
          class="w-auto m-auto ml-0 h-auto border-none"
          id="locale-select"
          v-model="$i18n.locale"
          @change="localChageHandler"
        >
          <option value="ja">日本語</option>
          <option value="en">English</option>
        </select>
      </form>
      <button
        v-if="route.path != '/'"
        class="hidden md:block ml-auto text-2xl"
        @click="logout"
      >
        {{ $t("Header.logOut") }}
      </button>
      <button
        class="md:hidden ml-auto text-2xl"
        @click="isMenuOpen = !isMenuOpen"
      >
        <img class="w-8" src="../assets/menu.svg" />
      </button>
    </div>
  </div>
  <div
    v-if="isMenuOpen"
    class="md:hidden fixed w-full h-full bg-black z-30 bg-opacity-60"
    @click="isMenuOpen = !isMenuOpen"
  >
  </div>
  <div
    v-if="isMenuOpen"
    class="md:hidden fixed inset-0 m-auto bg-slate-200 w-4/5 h-1/4 opacity-90 z-40 flex items-center justify-center rounded-3xl"
  >
    <div class="flex flex-col gap-8">
      <form class="flex items-center mx-auto w-fit">
        <label class="whitespace-nowrap" for="locale-select"
          >{{ $t("language") }}：
        </label>
        <select
          class="bg-slate-200"
          id="locale-select"
          v-model="$i18n.locale"
        >
          <option value="ja">日本語</option>
          <option value="en">English</option>
        </select>
      </form>
      <button class="text-2xl" @click="logout">
        {{ $t("Header.logOut") }}
      </button>
    </div>
  </div>
</template>
