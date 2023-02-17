<script lang="ts" setup>
</script>

<template>
  <div class="header">
    <button class="header-title">技大祭2023</button>
    <button class ="header-back">ログアウト</button>
  </div>
</template>

<style>
  .header{
    border-bottom: solid 1px #d3d3d3;
    @apply
      fixed
      top-0
      left-0
      flex
      bg-white
      z-10
      sticky
      py-4
      w-full
      fixed;
  }

  .header-title{
    @apply
      font-bold
      decoration-gray-300
      text-2xl
      m-auto
  }

  .header-back {
    @apply
      decoration-gray-300
      text-2xl
      m-auto
  }
</style>

