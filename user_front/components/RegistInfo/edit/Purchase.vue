<script lang="ts" setup>
import { Purchase } from "@/types";
import { FoodProduct, FesDate, Date } from "~~/types/mypage/registAlarm";
import { useField, useForm } from "vee-validate";
import { editPurchaseSchema } from "~/utils/validate";
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

const { meta, isSubmitting } = useForm({
  validationSchema: editPurchaseSchema,
  initialValues: {
    item: props.name,
    foodProductId: props.foodProductId,
    shopId: props.shopId,
    isFresh: props.isFresh,
    fesDateId: props.fesDateId,
  },
});
const { handleChange: handleFoodProduct, errorMessage: foodProductError } = useField("foodProductId");
const { handleChange: handleShop, errorMessage: shopError } = useField("shopId");
const { handleChange: handleItem, errorMessage: itemError } = useField("item");
const { handleChange: handleIsFresh, errorMessage: isFreshError } = useField("isFresh");
const { handleChange: handleFesDate, errorMessage: fesDateError } = useField("fesDateId");

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
  if (props.id === null) {
    await useFetch(config.APIURL + "/purchase_lists", {
      method: "POST",
      params: {
        items: newName.value,
        is_fresh: newIsFresh.value,
        food_product_id: newFoodProductId.value,
        shop_id: newShopId.value,
        fes_date_id: newFesDateId.value,
      },
    })
  }else{
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
  }
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
      <select class="entry" v-model="newFoodProductId" @change="handleFoodProduct" :class="{'error_border': foodProductError}">
        <option value="" disabled selected>選択してください</option>
        <option
          v-for="(list, i) in foodProducts"
          :key="i"
          :value="list.id"
        >
          {{ list.name }}
        </option>
      </select>
      <div class="error_msg">{{ foodProductError }}</div>
      <div class="text">購入品名</div>
      <input class="entry" v-model="newName" @change="handleItem" :class="{'error_border': itemError}"/>
      <div class="error_msg">{{ itemError }}</div>
      <div class="text">生ものか</div>
      <select class="entry" v-model="newIsFresh" @change="handleIsFresh" :class="{'error_border': isFreshError}">
        <option value="" disabled selected>選択してください</option>
        <option value="true">生もの</option>
        <option value="false">加工品</option>
      </select>
      <div class="error_msg">{{ isFreshError }}</div>
      <div class="text">購入店舗</div>
      <select class="entry" v-model="newShopId" @change="handleShop" :class="{'error_border': shopError}">
        <option value="" disabled selected>選択してください</option>
        <option
          v-for="(list, i) in purchases"
          :key="i"
          :value="list.id"
        >
          {{ list.name }}
        </option>
      </select>
      <div class="error_msg">{{ shopError }}</div>
      <div class="text">購入日</div>
        <select class="entry" v-model="newFesDateId" @change="handleFesDate" :class="{'error_border': fesDateError}">
          <option value="" disabled selected>選択してください</option>
          <option
            v-for="dateId in fesDates"
            :key="dateId.id"
            :value="dateId.id"
          >
            {{ dateId.date }}
          </option>
        </select>
        <div class="error_msg">{{ fesDateError }}</div>
      <div class="flex justify-between mt-8 mx-8">
        <RegistPageButton text="リセット" @click="reset()" />
        <RegistPageButton :disabled="!meta.valid || isSubmitting" text="✓編集" @click="editPurchase()" />
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
  border-top: solid 1px #717171;
  border-bottom: solid 1px #e0e0e0;
  border-radius: 5px;
  background-color: white;
}
</style>
