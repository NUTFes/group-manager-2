<script lang="ts" setup>

</script>

<template>
  <RegistInfoWideCard>
    <template #body>
      <div class="mx-10 pb-8 font-medium">
        名前
        <div class="text-2xl">
          技大太郎
        </div>
      </div>
        <RegistInfoDivideBar />
      <div class="m-2 text-base">
        <p class="font-medium text-lg">所属</p>
        <div class="flex items-center">分野<RegistInfoTriangle />情報・経営システム工学課程</div>
        <div class="flex items-center">学年<RegistInfoTriangle />B2</div>
        <div class="flex items-center">学籍<RegistInfoTriangle />21100491</div>
      </div>
      <RegistInfoDivideBar />
      <div class="text-base mb-10">
        <p class="font-medium">詳細情報</p>
          <div class="character2">email</div>
          <div class="character2">000-1234-5678</div>
      </div>
    </template>
    <template #method>
      <div class="absolute right-4">
        <EditButton />
      </div>
    </template>
  </RegistInfoWideCard>
</template>
