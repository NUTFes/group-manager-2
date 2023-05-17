<script lang="ts" setup>
import { News } from "@/types";

const config = useRuntimeConfig();
const state = reactive({
  title: "",
  body: "",
  updateDate: "",
});
onMounted(async () => {
  const news = await $fetch<News[]>(config.APIURL + "/news");
  state.title = news[0].title;
  state.body = news[0].body;
  state.updateDate = new Date(news[0].updated_at).toLocaleDateString("ja-JP");
});
</script>

<template>
  <div class="w-full rounded-md border-slate-300 border">
    <div class="text-slate-900 text-2xl font-bold p-2 bg-slate-200">
      <p>{{ $t("Mypage.notice") }}</p>
    </div>
    <div class="text-slate-800 flex flex-col gap-1 py-2 px-4">
      <p class="text-xl">{{ state.title }}</p>
      <div class="bg-slate-200 p-1">
        <p class="text-lg">{{ state.body }}</p>
      </div>
      <p class="text-md ml-auto w-fit">
        {{ $t("Mypage.updateDate") }}:{{ state.updateDate }}
      </p>
    </div>
  </div>
</template>
