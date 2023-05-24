<script lang="ts" setup>
import { loginCheck } from "~~/utils/methods";

const router = useRouter()
const config = useRuntimeConfig();
const groupId = ref<number>(0)
const announcement = ref<string>("")

onMounted(async () => {
  // ログインしていない場合は/welcomeに遷移させる
  loginCheck()
  groupId.value = Number(localStorage.getItem("group_id"));
})

const postAnnouncement = () => {
  useFetch(config.APIURL + "/announcements", {
    method: "POST",
    params: {
      group_id: groupId.value,
      message: announcement.value,
    },
    headers: {
      "Content-Type": "application/json",
    },
  })
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
</script>

<template>
  <NuxtLink to="/mypage" class="ml-4 text-left text-pink-500 text-2xl hover:font-bold">マイページに戻る</NuxtLink>
  <div class="mx-[10%] my-[5%]">
    <h1 class="text-4xl ">会場アナウンス文の申請</h1>
    <Card>
      <div class="text-left">
        <span class="text-3xl mr-4">会場アナウンス文</span>
      </div>
      <textarea class="border-2 w-[60%]" v-model="announcement"></textarea>
      <RegistPageButton text="登録" @click="postAnnouncement"></RegistPageButton>
    </Card>
  </div>
</template>
