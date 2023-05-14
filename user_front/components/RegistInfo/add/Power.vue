<script lang="ts" setup>
import { useField, useForm } from 'vee-validate'
import { editPowerSchema } from '~/utils/validate'
const config = useRuntimeConfig()

const { meta, isSubmitting } = useForm({
  validationSchema: editPowerSchema,
})
const { handleChange: handleItem, errorMessage: itemError } = useField('productName')
const { handleChange: handlePower, errorMessage: powerError } = useField('maxPower')
const { handleChange: handleManufacturer, errorMessage: manufacturerError } = useField('manufacturer')
const { handleChange: handleModel, errorMessage: modelError } = useField('model')
const { handleChange: handleUrl, errorMessage: urlError } = useField('url')

interface Props {
  groupId: number | null
}
interface Emits {
  (e: 'update:add-power', isEditPower: boolean): void
  (e: 'reloadPower', reload: null): void
}

const props = withDefaults(defineProps<Props>(), {
  groupId: null,
})
const emits = defineEmits<Emits>()

const newItem = ref<string>()
const newPower = ref<number | null>()
const newManufacturer = ref<string>()
const newModel = ref<string>()
const newUrl = ref<string>()

const addPowerClose = () => {
  emits('update:add-power', false)
}
const reloadPower = () => {
  emits('reloadPower', null)
}
const addPower = async () => {
  await useFetch(config.APIURL + "/power_orders", {
    method: "POST",
    params: {
      group_id: props.groupId,
      item: newItem.value,
      power: newPower.value,
      manufacturer: newManufacturer.value,
      model: newModel.value,
      item_url: newUrl.value,
    },
  })
  reloadPower()
  addPowerClose()
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
  <Modal title="電力申請の追加">
    <template #close>
      <div class="flex justify-end">
        <button @click="addPowerClose()" class="hover:text-black hover:opacity-75"
        >✖</button>
      </div>
    </template>
    <template #form>
      <div class="text">使用物品名</div>
      <input class="entry" v-model="newItem" @change="handleItem" :class="{'error_border': itemError}">
      <div class="error_msg">{{ itemError }}</div>
      <div class="text">最大定格電力[W]</div>
      <input type="number" class="entry" v-model="newPower" @change="handlePower" :class="{'error_border': powerError}">
      <div class="error_msg">{{ powerError }}</div>
      <div class="text">メーカー</div>
      <input class="entry" v-model="newManufacturer" @change="handleManufacturer" :class="{'error_border': manufacturerError}">
      <div class="error_msg">{{ manufacturerError }}</div>
      <div class="text">型番</div>
      <input class="entry" v-model="newModel" @change="handleModel" :class="{'error_border': modelError}">
      <div class="error_msg">{{ modelError }}</div>
      <div class="text">URL</div>
      <input class="entry" v-model="newUrl" @change="handleUrl" :class="{'error_border': urlError}">
      <div class="error_msg">{{ urlError }}</div>
      <div class="flex justify-between mt-8 mx-8">
        <RegistPageButton text="リセット" @click="reset()" />
        <RegistPageButton :disabled="!meta.valid || isSubmitting" text="✓追加" @click="addPower()" />
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
  width:80%;
}
</style>
