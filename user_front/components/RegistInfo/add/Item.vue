<script lang="ts" setup>
import { Item, ItemList } from "@/types/regist/item"
import { useField, useForm } from 'vee-validate'
import { editItemSchema } from '~/utils/validate'
const config = useRuntimeConfig()

const { meta, isSubmitting } = useForm({
  validationSchema: editItemSchema,
})
const { handleChange: handleName, errorMessage: nameError } = useField('itemNameId')
const { handleChange: handleNum, errorMessage: numError } = useField('itemNum')

interface Props {
  groupId: number | null
}

interface Emits {
  (e: 'update:addItem', isAddItem: boolean): void
  (e: 'reloadItem', v: null): void
}

const props = withDefaults(defineProps<Props>(), {
  groupId: null,
})

const emits = defineEmits<Emits>()
const itemList = ref<ItemList[]>([]);

onMounted(async () => {
  if (Number(localStorage.getItem("group_category_id")) === 3) {
    const itemData = await $fetch<Item>(config.APIURL + "/api/v1/get_stage_rentable_items");
    itemData.data.forEach((item) => {
      itemList.value.push(item);
    });
  } else {
    const itemData = await $fetch<Item>(config.APIURL + "/api/v1/get_shop_rentable_items");
    itemData.data.forEach((item) => {
      itemList.value.push(item);
    });
  }
})

const newItem = ref<number | null>()
const newNum = ref<number | null>()

const addItemClose = () => {
  emits('update:addItem', false)
}

const reloadItem = () => {
  emits('reloadItem', null)
}

const addItem = async () => {
  await useFetch(config.APIURL + "/rental_orders", {
    method: "POST",
    params: {
      group_id: props.groupId,
      rental_item_id: newItem.value,
      num: newNum.value,
    },
  })
  reloadItem()
  addItemClose()
};

const reset = () => {
  newItem.value = null
  newNum.value = null
}

</script>

<template>
  <Modal title="貸出物品の追加">
    <template #close>
      <div class="flex justify-end">
        <button @click="addItemClose()" class="hover:text-black hover:opacity-75"
        >✖</button>
      </div>
    </template>
    <template #form>
      <div class="text">貸出物品</div>
      <select class="entry" v-model="newItem" @change="handleName" :class="{'error_border': nameError}">
        <option
          v-for="list in itemList"
          :key="list.id"
          :value="list.id"
        >{{ list.name }}
        </option>
      </select>
      <div class="error_msg">{{ nameError }}</div>
      <div class="text">個数</div>
      <input class="entry" v-model="newNum" @change="handleNum" :class="{'error_border': numError}">
      <div class="error_msg">{{ numError }}</div>
      <div class="flex justify-between mt-8 mx-8">
        <RegistPageButton text="リセット" @click="reset()" />
        <RegistPageButton :disabled="!meta.valid || isSubmitting" text="✓追加" @click="addItem()" />
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
