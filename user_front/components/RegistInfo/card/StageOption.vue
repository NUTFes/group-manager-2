<script lang="ts" setup>

</script>

<template>
  <div class="tracking-wide">
    <RegistInfoWideCard>
      <template #body>
        <div class="ml-8 mr-4 h-24">
        <div class="upper">機器▾</div>
        <div class="lower">不使用</div>
      </div>
      <RegistInfoDivideBar />
      <div class="h-24">
        <div class="upper">音楽▾</div>
        <div class="lower">不使用</div>
      </div>
      <RegistInfoDivideBar />
      <div class="h-24">
        <div class="upper">撮影▾</div>
        <div class="lower">禁止</div>
      </div>
      <RegistInfoDivideBar />
      <div class="h-24">
        <div class="upper">騒音▾</div>
        <div class="lower">無</div>
      </div>
      <RegistInfoDivideBar />
      <div class="h-24">
        <div class="upper">ステージ内容▾</div>
        <div class="w-80 break-normal">ああああああああああああああああああああああああああああああああああああああああああああ</div>
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

<style>
.upper {
  font-size: 18px;
  text-align: left;
}
.lower {
  font-size: 35px;
  text-align: center;
}
</style>
