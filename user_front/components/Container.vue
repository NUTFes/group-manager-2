<script lang="ts" setup>
const orderList = [
  {title: "副代表申請"},
  {title: "会場申請"},
  {title: "物品申請"},
  {title: "電力申請"},
  {title: "ステージ申請"},
  {title: "ステージオプション申請"},
  {title: "従業員申請"},
  {title: "販売食品申請"},
  {title: "購入品申請"},
]
</script>

<template>
  <div class="font-sans">
    <div class="flex justify-between m-4 bg-white-100 text-xl font-bold">
      <button class="bg-gray-100 text-pink-500 hover:bg-gray-200 hover:shadow-lg">マイページに戻る</button>
      <div class="flex-auto ml-8">参加団体登録・編集ページ</div>
      <select class="bg-gray-100 cursor-pointer">
        <option value="">PopularMusicClub</option>
      </select>
    </div>
    <ul class="flex">
      <li v-for="order in orderList" :key="order.title">
        <a class="title">{{ order.title }}</a>
      </li>
    </ul>
      <div class="height">
        <slot name="body"/>
      </div>
  </div>
</template>

<style>
.title {
  @apply
    bg-gray-100
    inline-block
    py-2
    px-4
    rounded-t-xl
    font-semibold
    hover:bg-gray-200
    hover:shadow-lg
    cursor-pointer
}

.height {
  height: 80vh;
  @apply
    w-full
    bg-gray-200
}
</style>
