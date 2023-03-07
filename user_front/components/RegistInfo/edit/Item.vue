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

const update = (registInfo: Partial<Regist>) => {
  emits('update:reload', {...props, ...registInfo})
}

const num = computed({
  get(): number {
    return props.num
  },
  set(num: number) {
    update({ num })
  }
})

const item = computed({
  get(): number {
    return props.item
  },
  set(item: number) {
    update({ item })
  }
})

// interface Props {
//   itemValue: Regist
// }


const itemList = ref<ItemList[]>([]);

interface RentalItem {
  num: number
  name: string
}
const rentalItem = ref<RentalItem>()

onMounted(async () => {
  const itemData = await $fetch<Item>(config.APIURL + "/api/v1/get_stage_rentable_items");
  itemData.data.forEach((item) => {
    itemList.value.push(item);
  });
})

const registerItem = async () => {
  await $fetch(config.APIURL + "/rental_orders/" + props.id, {
    method: "PUT",
    params: {
      group_id: props.groupId,
      rental_item_id: item,
      num: num,
    },
    // headers: {
    //   "Content-Type": "application/json",
    // },
  })
  emits('update:reload', props)
  closeEditItem()
};
</script>

<template>
  <Modal title="貸出物品の編集">
    <template #close>
      {{ rentalItem }}
      <div class="flex justify-end">
        <button @click="closeEditItem()" class="hover:text-black hover:opacity-75"
        >✖</button>
      </div>
    </template>
    <template #form>
      groupID{{ props.groupId }}<br>
      id:{{ props.id }}<br>
      <div class="text">貸出物品</div>
      <select class="entry" v-model="item">
        <option
          v-for="list in itemList"
          :key="list.id"
          :value="list.id"
        >{{ list.name }}
        </option>
      </select>
      {{ props.item }}
      <div class="text">個数</div>
      <input class="entry" v-model="num" />
      {{ props.num }}
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
