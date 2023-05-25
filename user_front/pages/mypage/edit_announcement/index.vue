<script lang="ts" setup>

const config = useRuntimeConfig();
const groupId = ref<number>(0)
const announcement = ref<string>("")

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
}
</script>

<template>
  <NuxtLink to="/mypage" class="ml-4 text-left text-pink-500 text-2xl hover:font-bold">{{ $t('RegistInfo.return') }}</NuxtLink>
  <div class="mx-[10%] my-[5%]">
    <h1 class="text-4xl ">{{ $t('Announcement.editAnnouncement') }}</h1>
    <Card>
      <div class="text-left">
        <span class="text-3xl mr-4">{{ $t('Announcement.text') }}</span>
      </div>
      <textarea class="border-2 w-[60%]" v-model="announcement"></textarea>
      <RegistPageButton :text="$t('Announcement.edit')" @click="postAnnouncement"></RegistPageButton>
    </Card>
  </div>
</template>
