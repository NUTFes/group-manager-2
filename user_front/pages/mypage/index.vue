<script lang="ts" setup>
import {getCurrentUser, loginCheck} from '@/utils/methods'

definePageMeta({
  layout: false,
});

const state = reactive({currentUserName: '',});

onMounted(async()=>{
  await loginCheck()
  const currentUser = await getCurrentUser()
  state.currentUserName = currentUser?.data.user.name || ''
})

const links: {to:string; text:string}[] = [
  { to: "/mypage/edit_group", text: "参加団体情報の編集" },
  { to: "/mypage/profile", text: "ユーザー情報" },
  { to: "/mypage/edit_user_info", text: "ユーザー情報編集" },
  { to: "/mypage/password_reset", text: "パスワード変更" },
];
</script>

<template>
  <Header />
  <div class="center">
    <MypageCard>
      <template #mypageCard>
        <div class="p-5  mb-2">
          <div class="user-font pb-4">{{ state.currentUserName }}様</div>
          <p>技大祭に参加していただき誠にありがとうございます。</p>
          <p >登録情報の確認や変更が行えます。入力締め切りはお守りいただくよう、よろしくお願いします。</p>
          <p class="text-xl pt-12">各種操作</p>
          <div class="py-4">
            <MypageButton text="登録情報の確認はこちら" link="/regist_info"></MypageButton>
          </div>
          <div class="flex text-pink-400 ">
            <ui v-for="link in links" :key="link.text">
              <nuxt-link :to="link.to" class="pr-5 text-xl">{{ link.text }}</nuxt-link>
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
  .center{
    @apply
      flex
      justify-center
      items-center
      pt-5
  }

  .user-font{
    @apply
      text-2xl
      font-bold
  }


</style>
