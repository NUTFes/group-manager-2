<script lang="ts" setup>

</script>

<template>
  <RegistInfoNarrowCard>
    <template #body>
      <div class="absolute w-full mt-8 text-4xl font-[350] text-center">
        パーテーション足
      </div>
      <p class="absolute bottom-4 left-16 font-[350]">
        <span class="text-5xl">
          100
        </span>
        <span class="text-2xl">個</span>
      </p>
    </template>
    <template #method>
      <div class="absolute right-4 bottom-2">
        <div class="my-2">
          <EditButton />
        </div>
      <DeleteButton />
      </div>
    </template>
  </RegistInfoNarrowCard>
</template>
