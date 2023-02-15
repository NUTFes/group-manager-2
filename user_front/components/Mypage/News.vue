<script lang="ts" setup>
import {News} from '@/types'

const config = useRuntimeConfig();
const { data: news } = await useFetch<News[]>(config.baseURL + "/news");

const title = news.value![0].title;
const body = news.value![0].body;
const updateDate = new Date(news.value![0].updated_at).toLocaleDateString('ja-JP');
</script>

<template>
  <div class="news-card">
    <div class="news-header">
      <span>お知らせ</span>
    </div>
    <div class="news-content">
      <div class="news-title">{{ title }}</div>
      <div class="news-body">{{ body }}</div>
      <div class="news-date">更新日： {{ updateDate }}</div>
    </div>
  </div>
</template>

<style>
  .news-card {
    border-radius: 5px;
    width: 1000px;
  }

  .news-header {
    color: #333333;
    font-size: 24px;
    font-weight: bold;
    background-color: #eceff1;
    padding: 1% 1% 1% 2%;
  }

  .news-content {
    background-color: #ffffff;
    border-left: solid 1px #d3d3d3;
    border-right: solid 1px #d3d3d3;
    border-bottom: solid 1px #d3d3d3;
    border-top: solid 1px #d3d3d3;
    padding: 1% 1% 1% 2%;
  }

  .news-title {
    font-size: 18px;
    color: #333333;
    font-weight: bold;
  }

  .news-body {
    font-size: 16px;
    background-color: #f5f5f5;
    margin-top: 1%;
    padding: 1% 1% 1% 1%;
  }

  .news-date {
    font-size: 12px;
    text-align: right;
    margin-top: 1%;
  }
</style>
