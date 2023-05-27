<script lang="ts" setup>
import { News } from "@/types";

const config = useRuntimeConfig();
const state = reactive({
  // title: "",
  // body: "",
  news: [] as News[],
  updateDate: [] as string[],
});

onMounted(async () => {
  const news = await $fetch<News[]>(config.APIURL + "/news");
  state.news = news;

  news.forEach((newsItem) => {
    const date = new Date(newsItem.updated_at);
    state.updateDate.push(date.toLocaleDateString("ja-JP"));
  });
});
</script>

<template>
  <div class="w-full rounded-md border-slate-300 border">
    <div class="text-slate-900 text-2xl font-bold p-2 bg-slate-200">
      <p>{{ $t("Mypage.notice") }}</p>
    </div>
    <div
      class="text-slate-800 flex flex-col gap-4 p-4"
      style="max-height: 300px; overflow-y: auto"
    >
      <div v-for="(newsItem, i) in state.news" class="flex flex-col gap-2">
        <div class="flex flex-row items-center gap-2 border-b">
          <p class="text-xl">{{ newsItem.title }}</p>
          <p class="text-xs">{{ state.updateDate[i] }}</p>
        </div>
        <div class="bg-slate-200 p-2 rounded-md">
          <p class="text-lg">{{ newsItem.body }}</p>
        </div>
      </div>
    </div>
  </div>
</template>
