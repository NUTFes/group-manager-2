<script lang="ts" setup>
</script>

<template>
  <div class="tracking-widest font-light">
    <RegistInfoWideCard>
      <template #body>
      <div class="flex text-center mx-8 text-6xl">11月20日</div>
      <RegistInfoDivideBar />
      <div class="flex mx-4 text-6xl">晴</div>
      <RegistInfoDivideBar />
      <div class="mx-4 text-xl text-left">
        <div class="flex items-center">第1希望<RegistInfoTriangle />メインステージ</div>
        <div class="flex items-center">第2希望<RegistInfoTriangle />A講義室</div>
      </div>
    </template>
    <template #method>
      <div class="absolute right-8">
        <EditButton />
      </div>
    </template>
  </RegistInfoWideCard>
</div>
</template>
