<script lang="ts" setup>

const config = useRuntimeConfig()

interface Props {
  groupId: number | null,
  id: number | null,
  ownEquipment: boolean | null,
  bgm: boolean | null,
  cameraPermission: boolean | null,
  loudSound: boolean | null,
  stageContent: string,
}
interface Emits {
  (e: 'update:editStageOption', isEditStageOption: boolean): void
}

const props = withDefaults(defineProps<Props>(), {
  groupId: null,
  id: null,
  ownEquipment: null,
  bgm: null,
  cameraPermission: null,
  loudSound: null,
  stageContent: '',
})
const emits = defineEmits<Emits>()

const newOwnEquipment = ref<boolean>()
const newBgm = ref<boolean>()
const newCameraPermission = ref<boolean>()
const newLoudSound = ref<boolean>()
const newStageContent = ref<string>()

const itemsAvailable = [
  {id: 1, label: "使用", value: true },
  {id: 2, label: "使用しない", value: false },
]
const musicAvailable = [
  {id: 1, label: "使用", value: true },
  {id: 2, label: "使用しない", value: false },
]
const cameraAvailable = [
  {id: 1, label: "許可", value: true },
  {id: 2, label: "許可しない", value: false },
]
const loudAble = [
  {id: 1, label: "出す", value: true },
  {id: 2, label: "出さない", value: false },
]

const closeEditStageOption = () => {
  emits('update:editStageOption', false)
}

const editStageOption = async () => {
  await useFetch(config.APIURL + "/stage_common_options/" + props.id, {
    method: "PUT",
    params: {
      group_id: props.groupId,
      own_equipment: newOwnEquipment.value,
      bgm: newBgm.value,
      camera_permission: newCameraPermission.value,
      loud_sound: newLoudSound.value,
      stage_content: newStageContent.value,
    }
  })
  closeEditStageOption()
}

</script>

<template>
  <Modal title="ステージオプションの編集">
    <template #close>
      <div class="flex justify-end">
        <button @click="closeEditStageOption()" class="hover:text-black hover:opacity-75"
        >✖</button>
      </div>
    </template>
    <template #form>
      <div class="text">所持機器の利用</div>
      <select class="entry" v-model="newOwnEquipment">
        <option
          v-for="i in itemsAvailable"
          :value="i.value"
          :key="i.id"
        >
          {{ i.label }}
        </option>
      </select>
      <div class="text">音楽</div>
      <select class="entry" v-model="newBgm">
        <option
          v-for="m in musicAvailable"
          :value="m.value"
          :key="m.id"
        >
        {{ m.label }}
      </option>
      </select>
      <div class="text">撮影許可</div>
      <select class="entry" v-model="newCameraPermission">
        <option
          v-for="c in cameraAvailable"
          :value="c.value"
          :key="c.id"
        >
          {{ c.label }}
        </option>
      </select>
      <div class="text">騒音</div>
      <select class="entry" v-model="newLoudSound">
        <option
          v-for="l in loudAble"
          :value="l.value"
          :key="l.toString()"
        >
        {{ l.label }}
      </option>
      </select>
      <div class="text">ステージ内容</div>
      <textarea class="entry" v-model="newStageContent"/>
      <div class="flex justify-between mt-8 mx-8">
        <RegistPageButton text="reset"></RegistPageButton>
        <RegistPageButton text="register" @click="editStageOption()"></RegistPageButton>
      </div>
    </template>
  </Modal>
</template>

<style scoped>
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
