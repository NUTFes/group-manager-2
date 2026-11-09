<script lang="ts" setup>
import { useField, useForm } from 'vee-validate'
import { stageOptionSchema } from '~~/utils/validate'
const config = useRuntimeConfig()

interface Props {
  groupId: number | null,
  id: number | null,
  ownEquipment: boolean | null,
  bgm: boolean | null,
  cameraPermission: boolean | null,
  loudSound: boolean | null,
}
const props = withDefaults(defineProps<Props>(), {
  groupId: null,
  id: null,
  ownEquipment: null,
  bgm: null,
  cameraPermission: null,
  loudSound: null,
})

const { meta, isSubmitting } = useForm({
  validationSchema: stageOptionSchema,
  initialValues: {
    isItem: props.ownEquipment,
    isMusic: props.bgm,
    isCamera: props.cameraPermission,
    isNoise: props.loudSound,
  }
})
const { handleChange: handleOwnEquipment, errorMessage: ownEquipmentError } = useField('isItem')
const { handleChange: handleBgm, errorMessage: bgmError } = useField('isMusic')
const { handleChange: handleCameraPermission, errorMessage: cameraPermissionError } = useField('isCamera')
const { handleChange: handleLoudSound, errorMessage: loudSoundError } = useField('isNoise')

const newOwnEquipment = ref<Props['ownEquipment']>(props.ownEquipment)
const newBgm = ref<Props['bgm']>(props.bgm)
const newCameraPermission = ref<Props['cameraPermission']>(props.cameraPermission)
const newLoudSound = ref<Props['loudSound']>(props.loudSound)

const itemsAvailable = [
  {id: 1, label: "使用:use", value: true },
  {id: 2, label: "使用しない:not use", value: false },
]
const musicAvailable = [
  {id: 1, label: "使用:use", value: true },
  {id: 2, label: "使用しない:not use", value: false },
]
const cameraAvailable = [
  {id: 1, label: "許可:permit", value: true },
  {id: 2, label: "許可しない:not permit", value: false },
]
const loudAvailable = [
  {id: 1, label: "出す:produce a sound", value: true },
  {id: 2, label: "出さない:not sound", value: false },
]

interface Emits {
  (e: 'update:editStageOption', isEditStageOption: boolean): void
  (e: 'reloadStageOption', v: null): void
}
const emits = defineEmits<Emits>()
const reloadStageOption = () => {
  emits('reloadStageOption', null)
}
const closeEditStageOption = () => {
  emits('update:editStageOption', false)
}

const editStageOption = async () => {
  if (props.id === null) {
    await useFetch(config.APIURL + "/stage_common_options", {
      method: "POST",
      params: {
        group_id: props.groupId,
        own_equipment: newOwnEquipment.value,
        bgm: newBgm.value,
        camera_permission: newCameraPermission.value,
        loud_sound: newLoudSound.value,
      },
    })
  } else {
    await useFetch(config.APIURL + "/stage_common_options/" + props.id, {
      method: "PUT",
      params: {
        group_id: props.groupId,
        own_equipment: newOwnEquipment.value,
        bgm: newBgm.value,
        camera_permission: newCameraPermission.value,
        loud_sound: newLoudSound.value,
      }
    })
  }
  reloadStageOption()
  closeEditStageOption()
}

const reset = () => {
  newOwnEquipment.value = null
  newBgm.value = null
  newCameraPermission.value = null
  newLoudSound.value = null
  handleOwnEquipment(newOwnEquipment.value)
  handleBgm(newBgm.value)
  handleCameraPermission(newCameraPermission.value)
  handleLoudSound(newLoudSound.value)
}

</script>

<template>
  <Modal :title="$t('StageOption.editStageOption')">
    <template #close>
      <div class="flex justify-end">
        <button @click="closeEditStageOption()" class="hover:text-black hover:opacity-75"
        >✖</button>
      </div>
    </template>
    <template #form>
      <div class="text">{{ $t('StageOption.privateProperty') }}</div>
      <select class="entry" v-model="newOwnEquipment" @change="handleOwnEquipment" :class="{'error_border': ownEquipmentError}">
        <option
          v-for="i in itemsAvailable"
          :value="i.value"
          :key="i.id"
        >
          {{ i.label }}
        </option>
      </select>
      <div class="error_msg">{{ ownEquipmentError }}</div>
      <div class="text">{{ $t('StageOption.music') }}</div>
      <select class="entry" v-model="newBgm" @change="handleBgm" :class="{ 'error_border': bgmError }">
        <option
          v-for="m in musicAvailable"
          :value="m.value"
          :key="m.id"
        >
        {{ m.label }}
      </option>
      </select>
      <div class="error_msg">{{ bgmError }}</div>
      <div class="text">{{ $t('StageOption.photo') }}</div>
      <select class="entry" v-model="newCameraPermission" @change="handleCameraPermission" :class="{ 'error_border': cameraPermissionError }">
        <option
          v-for="c in cameraAvailable"
          :value="c.value"
          :key="c.id"
        >
          {{ c.label }}
        </option>
      </select>
      <div class="error_msg">{{ cameraPermissionError }}</div>
      <div class="text">{{ $t('StageOption.noise') }}</div>
      <select class="entry" v-model="newLoudSound" @change="handleLoudSound" :class="{ 'error_border': loudSoundError }">
        <option
          v-for="l in loudAvailable"
          :value="l.value"
          :key="l.id"
        >
        {{ l.label }}
      </option>
      </select>
      <div class="error_msg">{{ loudSoundError }}</div>
      <div class="flex justify-between mt-8 mx-8">
        <RegistPageButton :text="$t('Button.reset')" @click="reset()"></RegistPageButton>
        <RegistPageButton :disabled="!meta.valid || isSubmitting" :text="$t('Button.edit')" @click="editStageOption()"></RegistPageButton>
      </div>
    </template>
  </Modal>
</template>

<style scoped>
.error_msg {
  @apply mx-[10%] text-rose-600
}
.error_border {
  @apply border-2 border-rose-600
}
.text {
  margin: 3% 10% 0%;
}
.entry {
  margin: 0% 10%;
  border: 1px solid silver;
  border-top : solid 1px #717171;
  border-bottom : solid 1px #e0e0e0;
  border-radius: 5px;
  background-color: white;
}
</style>
