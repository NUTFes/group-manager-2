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
  if (announcement.value.length === 0) {
    alert('会場アナウンス文を入力してください\nPlease enter the text of the venue announcement')
    return
  }

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
      router.push("/regist/publicRelations");
    }
  )
}

const skip = () => {
  router.push("/regist/publicRelations");
};

const back = () => {
  router.push("/regist/power");
};
</script>

<template>
  <div class="mx-[10%] my-[5%]">
    <h1 class="text-4xl ">{{ $t('Announcement.regitstAnnouncement') }}</h1>
    <Card>
      <div class="text-left">
        <span class="text-3xl mr-4">{{ $t('Announcement.text') }}</span>
      </div>
      <textarea class="border-2 w-[60%]" v-model="announcement"></textarea>
        <Row>
          <RegistPageButton
            :text="$t('Button.back')"
            @click="back"
            variant="secondary"
          ></RegistPageButton>
          <RegistPageButton :text="$t('Announcement.regist')" @click="postAnnouncement"></RegistPageButton>
          <RegistPageButton
              :text="$t('Button.skip')"
              @click="skip"
              variant="secondary"
          ></RegistPageButton>
        </Row>
    </Card>
  </div>
</template>
