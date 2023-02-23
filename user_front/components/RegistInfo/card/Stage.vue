<script lang="ts" setup>

interface Props {
  groupId: number | null
  regist: string
  firstStage: string
  secondStage: string
  date: string
  isSunny: boolean | null
  setting: boolean | null
}


const stage = withDefaults(defineProps<Props>(), {
  groupId: null,
  regist: '',
  firstStage: '',
  secondStage: '',
  date: '',
  isSunny: null,
  setting: null
})

</script>

<template>
  <div class="tracking-widest font-light">
    <RegistInfoWideCard>
      <template #body>
      <div class="flex text-center mx-8 text-6xl">{{ stage.date }}</div>
      <RegistInfoDivideBar />
      <div class="flex mx-4 text-6xl">{{ stage.isSunny ? "晴" : "雨" }}</div>
      <RegistInfoDivideBar />
      <div class="mx-4 text-xl text-left">
        <div class="flex items-center">第1希望<RegistInfoTriangle />{{ stage.firstStage }}</div>
        <div class="flex items-center">第2希望<RegistInfoTriangle />{{ stage.secondStage }}</div>
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
