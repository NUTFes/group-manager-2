<script lang="ts" setup>
import { Item, ItemList } from "@/types/regist/item"
import { useField, useForm } from 'vee-validate'
import { editItemSchema } from '~/utils/validate'
const config = useRuntimeConfig();

interface Regist {
  groupId: number | null
  id: number | null
  item: number | null
  num: number | null
}

const props = withDefaults(defineProps<Regist>(), {
  groupId: null,
  id: null,
  item: null,
  num: null
})
const { meta, isSubmitting } = useForm({
  validationSchema: editItemSchema,
  initialValues: {
    itemNameId: props.item,
    itemNum: props.num
  }
})
const { handleChange: handleName, errorMessage: nameError } = useField('itemNameId')
const { handleChange: handleNum, errorMessage: numError } = useField('itemNum')


interface Emits {
  (e: 'update:editItem', isEditItem: boolean): void
  (e: 'reloadItem', v: null): void
}

const emits = defineEmits<Emits>()

const closeEditItem = () => {
  emits('update:editItem', false)
}

const reloadItem = () => {
  emits('reloadItem', null)
}
const itemList = ref<ItemList[]>([]);

const newItem = ref<Regist['item']>(props.item)
const newNum = ref<Regist['num']>(props.num)

onMounted(async () => {
  const itemData = await $fetch<Item>(config.APIURL + "/api/v1/get_stage_rentable_items");
  itemData.data.forEach((item) => {
    itemList.value.push(item);
  });
})

const editItem = async () => {
  await useFetch(config.APIURL + "/rental_orders" + "/" + props.id, {
    method: "PUT",
    params: {
      group_id: props.groupId,
      rental_item_id: newItem.value,
      num: newNum.value,
    },
  })
  reloadItem()
  closeEditItem()
};

const reset = () => {
  newItem.value = null
  newNum.value = null
}

</script>

<template>
  <Modal title="貸出物品の編集">
    <template #close>
      <div class="flex justify-end">
        <button @click="closeEditItem()" class="hover:text-black hover:opacity-75"
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
      <input type="number" class="entry" v-model="newNum" @change="handleNum" :class="{'error_border': numError}"/>
      <div class="error_msg">{{ numError }}</div>
      <div class="flex justify-between mt-8 mx-8">
        <RegistPageButton text="リセット" @click="reset()"></RegistPageButton>
        <RegistPageButton :disabled="!meta.valid || isSubmitting" text="✓編集" @click="editItem()"></RegistPageButton>
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
