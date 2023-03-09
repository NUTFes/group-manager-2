<script lang="ts" setup>
import { Item, ItemList } from "@/types/regist/item"
const config = useRuntimeConfig();

interface Regist {
  groupId: number
  id: number
  item: number
  num: number
}

const props = withDefaults(defineProps<Regist>(), {
  groupId: 0,
  id: 0,
  item: 0,
  num: 0
})

interface Emits {
  (e: 'update:editItem', isEditItem: boolean): void
  (e: 'update:reload', registInfo: Regist): void
}

const emits = defineEmits<Emits>()

const closeEditItem = () => {
  emits('update:editItem', false)
}
const itemList = ref<ItemList[]>([]);

const newItem = ref<number>(props.item)
const newNum = ref<number>(props.num)

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
  closeEditItem()
};
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
      <select class="entry" v-model="newItem">
        <option
          v-for="list in itemList"
          :key="list.id"
          :value="list.id"
        >{{ list.name }}
        </option>
      </select>
      <div class="text">個数</div>
      <input type="number" class="entry" v-model="newNum" />
      <div class="flex justify-between mt-8 mx-8">
        <RegistPageButton text="reset"></RegistPageButton>
        <RegistPageButton text="register" @click="editItem()"></RegistPageButton>
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
