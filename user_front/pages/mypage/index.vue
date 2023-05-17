<script lang="ts" setup>
import { RegistInfo } from '@/types'
import { getCurrentUser, loginCheck } from '@/utils/methods'

definePageMeta({
  layout: false,
});

const state = reactive({ currentUserName: '', });
const registGroupId = ref<number>(0);
const registGroupCategoryId = ref<number>(0);
const config = useRuntimeConfig();

onMounted(async () => {
  await $fetch<RegistInfo>(config.APIURL + "/api/v1/current_user/current_regist_info",
    {
      headers: {
        "Content-Type": "application/json",
        "access-token": localStorage.getItem("access-token") || "",
        "client": localStorage.getItem("client") || "",
        "uid": localStorage.getItem("uid") || ""
      },
    },)
    .then((response) => {
      registGroupId.value = response.data[0].group.id
      registGroupCategoryId.value = response.data[0].group.group_category_id
      localStorage.setItem("group_id", registGroupId.value.toString());
      localStorage.setItem("group_category_id", registGroupCategoryId.value.toString());
    });
  await loginCheck()
  const currentUser = await getCurrentUser()
  state.currentUserName = currentUser?.data.user.name || ''
})

const links: { to: string; text: string }[] = [
  { to: "/mypage/edit_group", text: "Mypage.editGroup" },
  { to: "/mypage/edit_user_info", text: "Mypage.editUserInfo" },
  { to: "/mypage/password_reset", text: "Mypage.editPassword" },
  { to: "/regist/publicRelations", text: "Mypage.regitstPR" },
  { to: "/regist/announcement", text: "Mypage.regitstAnnouncemant" },
  { to: "/regist/venueMap", text: "Mypage.regitstVenueMap" },
];
</script>

<template>
  <Header />
  <div class="center">
    <MypageCard>
      <template #mypageCard>
        <div class="p-5  mb-2">
          <div class="user-font pb-4">{{ state.currentUserName }}{{ $t('Mypage.userName') }}</div>
          <p>{{ $t('Mypage.greeting1') }}</p>
          <p>{{ $t('Mypage.greeting2') }}</p>
          <p class="text-xl pt-12">{{ $t('Mypage.operations') }}</p>
          <div class="py-4">
            <MypageButton :text="$t('Mypage.check')" link="/regist_info"></MypageButton>
          </div>
          <div class="flex text-pink-400">
            <ui v-for="link in links" :key="link.text">
              <nuxt-link :to="link.to" class="pr-5 text-xl">{{ $t(link.text) }}</nuxt-link>
            </ui>
          </div>
        </div>
      </template>
    </MypageCard>
  </div>
  <!-- 現状うまくいかないのでコメントアウトしていく
  <div class="center">
    <MypageRegistAlarm />
  </div> -->
  <div class="center">
    <MypageNews />
  </div>
  <Footer />
</template>


<style>
.center {
  @apply flex justify-center items-center pt-5
}

.user-font {
  @apply text-2xl font-bold
}
</style>
