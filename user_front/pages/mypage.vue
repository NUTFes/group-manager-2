<script lang="ts">
import { MypageCard } from '~~/.nuxt/components';

  definePageMeta({
    layout: false,
  });

  // const currentUser: string = "user";
  export default {
    setup() {
      const currentUser: string = "currentUser";
      const links: {to:string; text:string}[] = [
        { to: "/", text: "参加団体情報の編集" },
        { to: "/", text: "ユーザー情報" },
        { to: "/", text: "ユーザー情報編集" },
        { to: "/", text: "パスワード変更" },
      ];
      return { currentUser, links };
    },
  }
</script>

<template>
  <Header />
  <div class="center">
    <MypageCard>
      <template #mypageCard>
        <div class="p-5  mb-2">
          <div class="user-font pb-4">{{ currentUser }}様</div>
          <p>技大祭に参加していただき誠にありがとうございます。</p>
          <p >登録情報の確認や変更が行えます。入力締め切りはお守りいただくよう、よろしくお願いします。</p>
          <p class="text-xl pt-12">各種操作</p>
          <div class="py-4">
            <MypageButton text="登録情報の確認はこちら"></MypageButton>
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
