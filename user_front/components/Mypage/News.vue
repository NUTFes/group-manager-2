<script lang="ts" setup>
import { News } from "@/types";

const config = useRuntimeConfig();
const state = reactive({
  // title: "",
  // body: "",
  news : [] as News[],
  updateDate: [] as string[],
});

onMounted(async () => {
  const news = await $fetch<News[]>(config.APIURL + "/news");
  state.news = news;

  news.forEach((newsItem)=>{
    const date = new Date(newsItem.updated_at);
    state.updateDate.push(date.toLocaleDateString("ja-JP"));
  })
});
</script>

<template>
  <div class="w-full rounded-md border-slate-300 border">
    <div class="text-slate-900 text-2xl font-bold p-2 bg-slate-200">
      <p>{{ $t("Mypage.notice") }}</p>
    </div>
    <div class="text-slate-800 flex flex-col gap-1 py-2 px-4" style="max-height: 200px; overflow-y: auto;">
      <div v-for="newsItem, i in state.news">
        <div class="border-b-2">
          <p class="text-xl p-2">{{ newsItem.title }}</p>
          <p class="text-xs p-2">created:{{ state.updateDate[i] }}</p>
            <div class="bg-slate-400 mb-8">
              <p class="text-lg">{{ newsItem.body }}</p>
            </div>
          </div>
        </div>
      </div>
      <p class="text-md ml-auto w-fit">
          {{ $t("Mypage.updateDate") }}:{{ state.updateDate[0] }}
      </p>
  </div>
</template>
