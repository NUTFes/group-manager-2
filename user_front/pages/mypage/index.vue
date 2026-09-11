<script lang="ts" setup>
import { RegistInfo } from "@/types";
import { getCurrentUser, loginCheck } from "@/utils/methods";

definePageMeta({
  layout: false,
});

const state = reactive({ currentUserName: "" });
const registGroupId = ref<number>(0);
const registGroupCategoryId = ref<number>(0);
const config = useRuntimeConfig();
const is_external = ref<boolean>(false);
const isLoading = ref(true); // ローディング状態を管理するフラグ


onMounted(async () => {
  isLoading.value = true; // データ取得開始時にローディングを true に設定
  loginCheck();
  await $fetch<RegistInfo>(
    config.APIURL + "/api/v1/current_user/current_regist_info",
    {
      headers: {
        "Content-Type": "application/json",
        "access-token": localStorage.getItem("access-token") || "",
        client: localStorage.getItem("client") || "",
        uid: localStorage.getItem("uid") || "",
      },
    }
  ).then((response) => {
    registGroupId.value = response.data[0].group.id;
    registGroupCategoryId.value = response.data[0].group.group_category_id;
    is_external.value = response.data[0].group.is_external;
    localStorage.setItem("group_id", registGroupId.value.toString());
    localStorage.setItem(
      "group_category_id",
      registGroupCategoryId.value.toString()
    );
  });
  isLoading.value = false; // データ取得終了時にローディングを false に設定
  await loginCheck();
  const currentUser = await getCurrentUser();
  state.currentUserName = currentUser?.data.user.name || "";
});

// 食品販売を行う団体のみが、mypage/edit_cooking_processにいけるようにする
const links: { to: string; text: string }[] = [
  { to: "/mypage/edit_group", text: "Mypage.editGroup" },
  { to: "/mypage/publicRelations", text: "Mypage.editPR" },
  { to: "/mypage/edit_user_info", text: "Mypage.editUserInfo" },
  { to: "/regist/venueMap", text: "Mypage.regitstVenueMap" },
  { to: "/mypage/password_reset", text: "Mypage.editPassword" },
  { to: "/mypage/edit_announcement", text: "Mypage.editAnnouncemant" },
  { to: "/mypage/edit_contact_person", text: "Mypage.editContactPerson" },
];

// 食品販売用のリストを作る
const linksGroupCategoryId_1 = [...links,  { to: "/mypage/edit_cooking_process", text: "Mypage.editCookingProcess"}]



const shouldDisplayLink = (link: { to: string; text: string }) => {
  return link.text !== "Mypage.editContactPerson" || is_external.value;
}



</script>

<template>
  <Header />
  <div
    class="flex flex-col gap-8 justify-center items-center md:mx-auto my-8 mx-2 md:w-3/5"
  >
    <MypageCard>
      <template #mypageCard>
        <div class="flex flex-col gap-4">
          <div class="text-2xl font-bold">
            {{ state.currentUserName }}{{ $t("Mypage.userName") }}
          </div>
          <div>
            <p>{{ $t("Mypage.greeting1") }}</p>
            <p>{{ $t("Mypage.greeting2") }}</p>
          </div>
          <div class="mt-4 flex flex-col items-center">
            <hr class="border-slate-400 w-full" />
            <p class="text-xl -translate-y-1/2 bg-slate-200 px-4">
              {{ $t("Mypage.operations") }}
            </p>
          </div>
          <!-- データを取り出してからリンクを表示する -->
          <div v-if="isLoading===false" class="flex flex-col gap-4 items-center">
            <MypageButton :text="$t('Mypage.check')" link="/regist_info" />
              <!-- 食品販売団体の場合 -->
            <div v-if="registGroupCategoryId === 1" class="grid md:grid-cols-2 justify-items-center my-2 gap-2 text-pink-400">
              <ui v-for="linkCook in linksGroupCategoryId_1" :key="linkCook.text">
                <nuxt-link v-if="shouldDisplayLink(linkCook)" :to="linkCook.to" class="text-lg">{{
                  $t(linkCook.text)
                }}</nuxt-link>
              </ui>
            </div>
            <!-- それ以外の場合 -->
            <div v-else class="grid md:grid-cols-2 justify-items-center my-2 gap-2 text-pink-400">
              <ui v-for="link in links" :key="link.text">
                <nuxt-link v-if="shouldDisplayLink(link)" :to="link.to" class="text-lg">{{
                  $t(link.text)
                }}</nuxt-link>
              </ui>
            </div>
          </div>
        </div>
      </template>
    </MypageCard>
    <MypageNews />
    <!-- 現状うまくいかないのでコメントアウトしていく -->
    <!-- <div class="center">
      <MypageRegistAlarm />
    </div> -->
    <div class="fixed bottom-0 w-full">
      <Footer />
    </div>
  </div>
</template>
