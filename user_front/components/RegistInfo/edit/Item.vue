<script lang="ts" setup>
import { Item, ItemList } from "@/types/regist/item"

const config = useRuntimeConfig();

interface Emits {
  (e: 'update:editItem', isEditItem: boolean): void
}
const emits = defineEmits<Emits>()

const closeEditItem = () => {
  emits('update:editItem', false)
}

interface Props {
  groupId: number
  id: number
  item: number
  num: number
}

const props = withDefaults(defineProps<Props>(), {
  groupId: 0,
  id: 0,
  item: 0,
  num: 0,
})

const itemList = ref<ItemList[]>([]);

const state = reactive({
  groupId: 0,
});

interface RentalItem {
  num: number
  name: string
}
const rentalItem = ref<RentalItem>()

const registerParams = reactive({
  num: 0,
  rentalItemId: 0,
}),

onMounted(async () => {
  const itemData = await $fetch<Item>(config.APIURL + "/api/v1/get_stage_rentable_items");
  itemData.data.forEach((item) => {
    itemList.value.push(item);
  });
  state.groupId = Number(localStorage.getItem("group_id"));
});

const registerItem = () => {
  $fetch(config.APIURL + "/rental_orders", {
    method: "PUT",
    params: {
      group_id: state.groupId,
      num: rentalItem.value?.num,
      rental_item_id: rentalItem.value?.name,
    },
    headers: {
      "Content-Type": "application/json",
    },
  })
  closeEditItem();
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
      <select class="entry" v-model="props.item">
        <option
          v-for="list in itemList"
          :key="list.id"
          :value="list.id"
        >{{ list.name }}
        </option>
      </select>
      <div class="text">個数</div>
      <input class="entry" v-model="props.num" />
      <div class="flex justify-between mt-8 mx-8">
        <RegistPageButton text="reset"></RegistPageButton>
        <RegistPageButton text="register" @click="registerItem()"></RegistPageButton>
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
