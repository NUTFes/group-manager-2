<script lang="ts" setup>
import { Item, ItemList } from "@/types/regist/item"
const config = useRuntimeConfig()

interface Props {
  groupId: number | null
  rentalItemId: number | null
  num: number | null
}

interface Emits {
  (e: 'update:addItem', isAddItem: boolean): void
}

const props = withDefaults(defineProps<Props>(), {
  groupId: null,
  rentalItemId: null,
  num: null,
})

const emits = defineEmits<Emits>()
const itemList = ref<ItemList[]>([]);

onMounted(async () => {
  const itemData = await $fetch<Item>(config.APIURL + "/api/v1/get_stage_rentable_items");
  itemData.data.forEach((item) => {
    itemList.value.push(item);
  });
})

const newItem = ref<Props['rentalItemId']>()
const newNum = ref<Props['num']>()

const addItemClose = () => {
  emits('update:addItem', false)
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
      <select class="entry" v-model="newItem">
        <option
          v-for="list in itemList"
          :key="list.id"
          :value="list.id"
        >{{ list.name }}
        </option>
      </select>
      <div class="text">個数</div>
      <input class="entry" v-model="newNum">
      <div class="flex justify-between mt-8 mx-8">
        <RegistPageButton text="リセット" @click="reset()" />
        <RegistPageButton text="✓追加" @click="addItem()" />
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
