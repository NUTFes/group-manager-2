<script lang="ts" setup>
import { Setting } from '~~/types'

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

interface Emits {
  (e: 'reloadStage', v: null): void
}
const emits = defineEmits<Emits>()
const reloadStage = () => {
  emits('reloadStage', null)
}

const config = useRuntimeConfig();
const isEditStage = ref<boolean>();
onMounted(async()=>{
const setting = await $fetch<Setting>(config.APIURL+ "/user_page_settings") || null
  isEditStage.value = setting.data[0].is_edit_stage_order
});

const isEditModal = ref<boolean>(false);
const openEditModal = () => {
  isEditModal.value = true
}
</script>

<template>
  <div class="tracking-widest font-light">
    <RegistInfoWideCard>
      <template #body>
      <div class="flex text-center mx-8 text-6xl">{{ stage.date }}</div>
      <RegistInfoDivideBar />
      <div class="flex mx-4 text-6xl">{{ stage.isSunny ? $t('Stage.sunny') : $t('Stage.rain') }}</div>
      <RegistInfoDivideBar />
      <div class="mx-4 text-xl text-left">
        <div class="flex items-center">{{ $t('Stage.firstPreference') }}<RegistInfoTriangle />{{ stage.firstStage }}</div>
        <div class="flex items-center">{{ $t('Stage.secondPreference') }}<RegistInfoTriangle />{{ stage.secondStage }}</div>
      </div>
    </template>
    <template v-if="isEditStage" #method>
      <div class="absolute right-8">
        <EditButton @click="openEditModal()" />
      </div>
    </template>
  </RegistInfoWideCard>
  </div>
  <RegistInfoEditStage
    v-if="isEditModal"
    v-model:edit-stage="isEditModal"
    :group-id="groupId"
    :id="id"
    :is-sunny="isSunny"
    :prepare-time-interval="prepareTimeInterval"
    :use-time-interval="useTimeInterval"
    :cleanup-time-interval="cleanupTimeInterval"
    :fes-date-id="fesDateId"
    :stage-first="firstId"
    :stage-second="secondId"
    @reload-stage="reloadStage()"
  />
</template>
