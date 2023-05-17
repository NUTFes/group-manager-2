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

onMounted(async () => {
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
    localStorage.setItem("group_id", registGroupId.value.toString());
    localStorage.setItem(
      "group_category_id",
      registGroupCategoryId.value.toString()
    );
  });
  await loginCheck();
  const currentUser = await getCurrentUser();
  state.currentUserName = currentUser?.data.user.name || "";
});

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
          <div class="flex flex-col gap-4 items-center">
            <MypageButton :text="$t('Mypage.check')" link="/regist_info" />
            <div class="grid md:grid-cols-2 justify-items-center my-2 gap-2 text-pink-400">
              <ui v-for="link in links" :key="link.text">
                <nuxt-link :to="link.to" class="text-lg">{{
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
