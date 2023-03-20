<script lang="ts" setup>
const config = useRuntimeConfig()

interface Props {
  groupId: number | null
  id: number | null
  item: string
  power: number | null
  manufacturer: string
  model: string
  url: string
}

interface Emits {
  (e: 'update:edit-power', isEditPower: boolean): void
}

const props = withDefaults(defineProps<Props>(),{
  groupId: null,
  id: null,
  item: '',
  power: null,
  manufacturer: '',
  model: '',
  url: '',
})
const emits = defineEmits<Emits>()

const newItem = ref<Props['item']>()
const newPower = ref<Props['power']>()
const newManufacturer = ref<Props['manufacturer']>()
const newModel = ref<Props['model']>()
const newUrl = ref<Props['url']>()

const closeEditPower = () => {
  emits('update:edit-power', false)
}

const editPower = async () => {
  await useFetch(config.APIURL + "/power_orders/" + props.id, {
    method: "PUT",
    params: {
      group_id: props.groupId,
      item: newItem.value,
      power: newPower.value,
      manufacturer: newManufacturer.value,
      model: newModel.value,
      url: newUrl.value,
    },
  })
  closeEditPower()
}

const reset = () => {
  newItem.value = ''
  newPower.value = null
  newManufacturer.value = ''
  newModel.value = ''
  newUrl.value = ''
}

</script>

<template>
  <Modal title="電力申請の編集">
    <template #close>
      <div class="flex justify-end">
        <button @click="closeEditPower()" class="hover:text-black hover:opacity-75"
        >✖</button>
      </div>
    </template>
    <template #form>
      <div class="text">使用物品名</div>
      <input class="entry" v-model="newItem"/>
      <div class="text">最大定格電力[W]</div>
      <input class="entry" v-model="newPower"/>
      <div class="text">メーカー</div>
      <input class="entry" v-model="newManufacturer"/>
      <div class="text">型番</div>
      <input class="entry" v-model="newModel"/>
      <div class="text">URL</div>
      <input class="entry" v-model="newUrl"/>
      <div class="flex justify-between mt-8 mx-8">
        <RegistPageButton text="リセット" @click="reset()"></RegistPageButton>
        <RegistPageButton text="✓編集" @click="editPower()"></RegistPageButton>
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
