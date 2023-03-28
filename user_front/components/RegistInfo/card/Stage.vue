<script lang="ts" setup>

interface Props {
  id: number | null
  groupId: number | null
  date: string
  fesDateId: number | null
  firstStage: string
  firstId: number | null
  secondStage: string
  secondId: number | null
  useTimeInterval: string,
  prepareTimeInterval: string,
  cleanupTimeInterval: string,
  isSunny: boolean | null
  setting: boolean | null
}

const stage = withDefaults(defineProps<Props>(), {
  id: null,
  groupId: null,
  date: '',
  fesDateId: null,
  firstStage: '',
  firstId: null,
  secondStage: '',
  secondId: null,
  isSunny: null,
  setting: null,
  useTimeInterval: '',
  prepareTimeInterval: '',
  cleanupTimeInterval: '',
})

const isEditStage = ref<boolean>(false)

const openEditStage = () => {
  isEditStage.value = true
}
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
        <EditButton @click="openEditStage()" />
      </div>
    </template>
  </RegistInfoWideCard>
  </div>
  <RegistInfoEditStage
    v-if="isEditStage"
    v-model:edit-stage="isEditStage"
    :group-id="groupId"
    :id="id"
    :is-sunny="isSunny"
    :prepare-time-interval="prepareTimeInterval"
    :use-time-interval="useTimeInterval"
    :cleanup-time-interval="cleanupTimeInterval"
    :fes-date-id="fesDateId"
    :stage-first="firstId"
    :stage-second="secondId"
  />
</template>
