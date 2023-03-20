<script lang="ts" setup>

interface Props {
  id: number | null
  groupId: number | null
  date: string
  regist: string
  firstStage: string
  secondStage: string
  useTimeInterval: string,
  prepareTimeInterval: string,
  cleanupTimeInterval: string,
  isSunny: boolean | null
  setting: boolean | null
}

const stage = withDefaults(defineProps<Props>(), {
  id: null,
  groupId: null,
  regist: '',
  date: '',
  firstStage: '',
  secondStage: '',
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
    :date="date"
    :id="id"
    :is-sunny="isSunny"
    :prepare-time-interval="prepareTimeInterval"
    :use-time-interval="useTimeInterval"
    :cleanup-time-interval="cleanupTimeInterval"

  />
</template>
