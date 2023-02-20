<script lang="ts" setup>

</script>

<template>
  <div class="tracking-widest font-light">
    <RegistInfoWideCard>
      <template #body>
        <div class="w-[37%] text-center pl-8 text-5xl font-light">
        Itemaaasd
      </div>
      <RegistInfoDivideBar />
      <div class="flex w-28 justify-end m-4 text-center">
        <div class="text-6xl font-light">100</div>
        <div class="mt-12 font-light text-ms">[W]</div>
      </div>
      <RegistInfoDivideBar />
      <div>
        <div class="flex items-center text-lg">
          <div class="w-20 ">メーカー</div>
          <RegistInfoTriangle />
          <div class="w-32 ">manufacturer</div>
        </div>
        <div class="flex items-center">
          <div class="w-20 h-6">型番</div>
          <RegistInfoTriangle />
          <div class="w-32 break-normal">model</div>
        </div>
      </div>
    </template>
    <template #method>
      <div class="absolute right-4">
        <div class="my-2">
          <EditButton />
        </div>
        <DeleteButton />
      </div>
    </template>
  </RegistInfoWideCard>
</div>
</template>
