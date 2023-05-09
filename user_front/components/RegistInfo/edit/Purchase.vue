<script lang="ts" setup>
import { Purchase } from "@/types";
import { FoodProduct, FesDate, Date } from "~~/types/mypage/registAlarm";
const config = useRuntimeConfig();

interface Regist {
  id: number | null
  groupId: number | null
  isFresh: boolean
  name: string
  foodProductId: number | null
  shopId: number | null
  fesDateId: number | null
}

const props = withDefaults(defineProps<Regist>(), {
  id: null,
  groupId: null,
  name: "",
  isFresh: false,
  foodProductId: null,
  shopId: null,
  fesDateId: null,
})

interface Emits {
  (e: 'update:editPurchase', isEditPurchase: boolean): void
  (e: 'reloadPurchase', v: null): void
}
const emits = defineEmits<Emits>()

const editPurchaseClose = () => {
  emits('update:editPurchase', false)
}
const editPurchaseReload = () => {
  emits('reloadPurchase', null)
}
const newName = ref<string>(props.name)
const newIsFresh = ref<boolean>(props.isFresh)
const newFoodProductId = ref<number | null>(props.foodProductId)
const newShopId = ref<number | null>(props.shopId)
const newFesDateId = ref<number | null>(props.fesDateId)

const purchases = ref<Purchase[]>([]);
const foodProducts = ref<FoodProduct[]>([]);
const fesDates = ref<Date[]>([]);

onMounted(async () => {
  loginCheck()
  const purchaseData = await $fetch<{ data: Purchase[] }>(
    config.APIURL + "/shops"
  );
  purchases.value = purchaseData.data;

  const foodProductData = await $fetch<{ data: FoodProduct[] }>(
    config.APIURL + "/api/v1/get_food_products_by_group_id/" + props.groupId
  );
  foodProducts.value = foodProductData.data;

  const fesDateData = await $fetch<{ data: FesDate[] }>(
    config.APIURL + "/fes_dates"
  );
  fesDateData.data.forEach((fesDate) => {
    fesDates.value.push(fesDate.fes_date);
  });
});

const editPurchase = async () => {
  await useFetch(config.APIURL + "/purchase_lists/" + props.id, {
    method: "PUT",
    params: {
      items: newName.value,
      is_fresh: newIsFresh.value,
      food_product_id: newFoodProductId.value,
      shop_id: newShopId.value,
      fes_date_id: newFesDateId.value,
    },
  })
  editPurchaseReload()
  editPurchaseClose()
};

const reset = () => {
  newName.value = ""
  newIsFresh.value = false
  newFoodProductId.value = null
  newShopId.value = null
  newFesDateId.value = null
}
</script>

<template>
  <Modal title="販売食品の編集">
    <template #close>
      <div class="flex justify-end">
        <button @click="editPurchaseClose()" class="hover:text-black hover:opacity-75">✖</button>
      </div>
    </template>
    <template #form>
      <div class="text">対象商品</div>
      <select class="entry" v-model="newFoodProductId">
        <option value="" disabled selected>選択してください</option>
        <option
          v-for="(list, i) in foodProducts"
          :key="i"
          :value="list.id"
        >
          {{ list.name }}
        </option>
      </select>
      <div class="text">購入品名</div>
      <input class="entry" v-model="newName" />
      <div class="text">生ものか</div>
      <select class="entry" v-model="newIsFresh">
        <option value="" disabled selected>選択してください</option>
        <option value="true">生もの</option>
        <option value="false">加工品</option>
      </select>
      <div class="text">購入店舗</div>
      <select class="entry" v-model="newShopId">
        <option value="" disabled selected>選択してください</option>
        <option
          v-for="(list, i) in purchases"
          :key="i"
          :value="list.id"
        >
          {{ list.name }}
        </option>
      </select>
      <div class="text">購入日</div>
        <select class="entry" v-model="newFesDateId">
          <option value="" disabled selected>選択してください</option>
          <option
            v-for="dateId in fesDates"
            :key="dateId.id"
            :value="dateId.id"
          >
            {{ dateId.date }}
          </option>
        </select>
      <div class="flex justify-between mt-8 mx-8">
        <RegistPageButton text="リセット" @click="reset()" />
        <RegistPageButton text="✓編集" @click="editPurchase()" />
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
  border-top: solid 1px #717171;
  border-bottom: solid 1px #e0e0e0;
  border-radius: 5px;
  background-color: white;
}
</style>
