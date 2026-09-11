<script lang="ts" setup>
import { Setting } from '~~/types'

interface Props {
  groupId: number
  id: number | null
  ownEquipment: boolean | null
  bgm: boolean | null
  cameraPermission: boolean | null
  loudSound: boolean | null
  setting: boolean | null
}
const option = withDefaults(defineProps<Props>(), {
  groupId: 0,
  id: null,
  ownEquipment: null,
  bgm: null,
  cameraPermission: null,
  loudSound: null,
  setting: null
})

interface Emits {
  (e: 'reloadStageOption', v: null): void
}
const emits = defineEmits<Emits>()
const reloadStageOption = () => {
  emits('reloadStageOption', null)
}

const config = useRuntimeConfig();
const isEditStageOption = ref<boolean>();
onMounted(async()=>{
const setting = await $fetch<Setting>(config.APIURL+ "/user_page_settings") || null
  isEditStageOption.value = setting.data[0].is_edit_stage_common_option
});
const isEditModal = ref<boolean>(false);
const openEditModal = () => {
  isEditModal.value = true
}
</script>

<template>
  <div class="tracking-wide">
    <RegistInfoWideCard>
      <template #body>
        <div class="ml-8 mr-4 h-24">
        <div class="upper">{{ $t('StageOption.privateProperty') }}</div>
        <div class="lower">{{ option.ownEquipment ? $t('StageOption.use') : $t('StageOption.notUse') }}</div>
      </div>
      <RegistInfoDivideBar />
      <div class="h-24">
        <div class="upper">{{ $t('StageOption.music') }}</div>
        <div class="lower">{{ option.bgm ? $t('StageOption.use') : $t('StageOption.notUse') }}</div>
      </div>
      <RegistInfoDivideBar />
      <div class="h-24">
        <div class="upper">{{ $t('StageOption.photo') }}</div>
        <div class="lower">{{ option.cameraPermission ? $t('StageOption.permit') : $t('StageOption.prohibition') }}</div>
      </div>
      <RegistInfoDivideBar />
      <div class="h-24">
        <div class="upper">{{ $t('StageOption.noise') }}</div>
        <div class="lower">{{ option.loudSound ? $t('StageOption.yes') : $t('StageOption.no') }}</div>
      </div>
      <RegistInfoDivideBar />
    </template>
    <template v-if="isEditStageOption" #method>
      <div class="absolute right-8">
        <EditButton @click="openEditModal()" />
      </div>
    </template>
  </RegistInfoWideCard>
  </div>
  <RegistInfoEditStageOption
    v-if="isEditModal"
    v-model:edit-stage-option="isEditModal"
    :group-id="groupId"
    :id="id"
    :own-equipment="ownEquipment"
    :camera-permission="cameraPermission"
    :bgm="bgm"
    :loud-sound="loudSound"
    @reload-stage-option="reloadStageOption"
  />
</template>

<style>
.upper {
  @apply
    text-[18px]
    text-left;
}
.lower {
  @apply
    text-[35px]
    text-center;
}
</style>
