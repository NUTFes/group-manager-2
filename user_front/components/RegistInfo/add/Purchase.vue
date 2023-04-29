<script lang="ts" setup>
import { Purchase } from '~~/types';
import { FoodProduct, FesDate, Date } from '~~/types/mypage/registAlarm';

const config = useRuntimeConfig()

interface Props {
  groupId: number | null
}
const props = withDefaults(defineProps<Props>(), {
  groupId: null,
})

interface Emits {
  (e: 'update:addPurchase', isAddPurchase: boolean): void
}
const emits = defineEmits<Emits>()

const purchases = ref<Purchase[]>([]);
const foodProducts = ref<FoodProduct[]>([]);
const fesDates = ref<Date[]>([]);

onMounted(async () => {
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

const newFoodProductId = ref<number|null>(null)
const newShopId = ref<number|null>(null)
const newFesDateId = ref<number|null>(null)
const newIsFresh = ref<boolean>(false)
const newItems = ref<string>('')

const addPurchaseClose = () => {
  emits('update:addPurchase', false)
}

const addPurchase = async () => {
  await useFetch(config.APIURL + "/purchase_lists/", {
    method: "POST",
    params: {
      group_id: props.groupId,
      food_product_id: newFoodProductId.value,
      shop_id: newShopId.value,
      fes_date_id: newFesDateId.value,
      is_fresh: newIsFresh.value,
      items: newItems.value,
    },
  })
  addPurchaseClose()
}

const reset = () => {
  newFoodProductId.value = null
  newShopId.value = null
  newFesDateId.value = null
  newIsFresh.value = false
}

</script>

<template>
  <Modal title="購入品申請の追加">
    <template #close>
      <div class="flex justify-end">
        <button @click="addPurchaseClose()" class="hover:text-black hover:opacity-75"
          >✖</button>
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
      <input class="entry" type="text" v-model="newItems" />
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
        <option v-for="dates in fesDates" :key="dates.id" :value="dates.id">
          {{ dates.date }}
        </option>
      </select>
      <div class="flex justify-between mt-8 mx-8">
        <RegistPageButton text="リセット" @click="reset()" />
        <RegistPageButton text="✓追加" @click="addPurchase()" />
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
