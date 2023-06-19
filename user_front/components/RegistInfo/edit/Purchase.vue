<script lang="ts" setup>
import { Purchase } from "@/types";
import { FoodProduct, FesDate, Date } from "~~/types/mypage/registAlarm";
import { useField, useForm } from "vee-validate";
import { editPurchaseSchema } from "~/utils/validate";
const config = useRuntimeConfig();

interface Regist {
  id: number | null;
  groupId: number | null;
  isFresh: boolean;
  name: string;
  foodProductId: number | null;
  shopId: number | null;
  fesDateId: number | null;
  purchaseDate: string | null;
  groupCategoryId: number;
  url: string | null;
}
const props = withDefaults(defineProps<Regist>(), {
  id: null,
  groupId: null,
  name: "",
  isFresh: false,
  foodProductId: null,
  shopId: null,
  fesDateId: null,
  purchaseDate: "",
  url: "",
});

const { meta, isSubmitting } = useForm({
  validationSchema: editPurchaseSchema,
  initialValues: {
    item: props.name,
    foodProductId: props.foodProductId,
    shopId: props.shopId,
    purchaseDate: props.purchaseDate,
  },
});
const { handleChange: handleFoodProduct, errorMessage: foodProductError } =
  useField("foodProductId");
const { handleChange: handleShop, errorMessage: shopError } =
  useField("shopId");
const { handleChange: handleItem, errorMessage: itemError } = useField("item");
const { handleChange: handlePurchaseDate, errorMessage: purchaseDateError } =
  useField("purchaseDate");

interface Emits {
  (e: "update:editPurchase", isEditPurchase: boolean): void;
  (e: "reloadPurchase", v: null): void;
}
const emits = defineEmits<Emits>();

const editPurchaseClose = () => {
  emits("update:editPurchase", false);
};
const editPurchaseReload = () => {
  emits("reloadPurchase", null);
};
const newName = ref<string>(props.name);
const newIsFresh = ref<boolean>(props.isFresh);
const newFoodProductId = ref<number | null>(props.foodProductId);
const newShopId = ref<number | null>(props.shopId);
const newFesDateId = ref<number | null>(props.fesDateId);
const newPurchaseDate = ref<string | null>(props.purchaseDate);
const newUrl = ref<string | null>(props.url);
const purchases = ref<Purchase[]>([]);
const foodProducts = ref<FoodProduct[]>([]);
const fesDates = ref<Date[]>([]);

onMounted(async () => {
  loginCheck();
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
        purchase_date: newPurchaseDate.value,
        url: newUrl.value,
      },
    });
  } else {
    await useFetch(config.APIURL + "/purchase_lists/" + props.id, {
      method: "PUT",
      params: {
        items: newName.value,
        is_fresh: newIsFresh.value,
        food_product_id: newFoodProductId.value,
        shop_id: newShopId.value,
        fes_date_id: newFesDateId.value,
        purchase_date: newPurchaseDate.value,
        url: newUrl.value,
      },
    });
  }
  editPurchaseReload();
  editPurchaseClose();
};

const reset = () => {
  newName.value = "";
  newIsFresh.value = false;
  newFoodProductId.value = null;
  newShopId.value = null;
  newFesDateId.value = 1;
  newPurchaseDate.value = "";
  //newUrl.value = 'https://aaa.com';
  newFesDateId.value = null;
  newUrl.value = "";
  handleFoodProduct(newFoodProductId.value);
  handleShop(newShopId.value);
  handleItem(newName.value);
  handlePurchaseDate(newPurchaseDate.value);
};
</script>

<template>
  <Modal :title="$t('Purchase.editPurchase')">
    <template #close>
      <div class="flex justify-end">
        <button
          @click="editPurchaseClose()"
          class="hover:text-black hover:opacity-75"
        >
          ✖
        </button>
      </div>
    </template>
    <template #form>
      <div class="text">
        {{
          groupCategoryId === 1
            ? $t("Purchase.target")
            : $t("Purchase.targetGoods")
        }}
      </div>
      <select
        class="entry"
        v-model="newFoodProductId"
        @change="handleFoodProduct"
        :class="{ error_border: foodProductError }"
      >
        <option value="" disabled selected>{{ $t("Purchase.select") }}</option>
        <option v-for="(list, i) in foodProducts" :key="i" :value="list.id">
          {{ list.name }}
        </option>
      </select>
      <div class="error_msg">{{ foodProductError }}</div>
      <div class="text">
        {{
          groupCategoryId === 1 ? $t("Purchase.name") : $t("Purchase.goodsName")
        }}
      </div>
      <input
        class="entry"
        v-model="newName"
        @change="handleItem"
        :class="{ error_border: itemError }"
      />
      <div class="error_msg">{{ itemError }}</div>
      <div v-if="groupCategoryId === 1">
        <div class="text">{{ $t("Purchase.rowFood") }}</div>
        <select
          class="entry"
          v-model="newIsFresh"
        >
          <option value="" disabled selected>
            {{ $t("Purchase.select") }}
          </option>
          <option value="true">{{ $t("Purchase.yes") }}</option>
          <option value="false">{{ $t("Purchase.no") }}</option>
        </select>
      </div>
      <div class="text">{{ $t("Purchase.place") }}</div>
      <select
        class="entry"
        v-model="newShopId"
        @change="handleShop"
        :class="{ error_border: shopError }"
      >
        <option value="" disabled selected>
          {{ $t("Purchase.select") }}
        </option>
        <option v-for="(list, i) in purchases" :key="i" :value="list.id">
          {{ list.name }}
        </option>
      </select>
      <div class="error_msg">{{ shopError }}</div>
      <div class="text">{{ $t("Purchase.date") }}</div>
      <input
        type="date"
        class="entry"
        v-model="newPurchaseDate"
        @change="handlePurchaseDate"
        :class="{ error_border: purchaseDateError }"
      >
      <div class="error_msg">{{ purchaseDateError }}</div>
      <div class="text">{{ $t("Purchase.URL") }}</div>
        <input
          class="entry"
          placeholder="https://sample.com"
          type="text"
          v-model="newUrl"
        />
      <div class="flex justify-between mt-8 mx-8">
        <RegistPageButton :text="$t('Button.reset')" @click="reset()" />
        <RegistPageButton
          :disabled="!meta.valid || isSubmitting"
          :text="$t('Button.edit')"
          @click="editPurchase()"
        />
      </div>
    </template>
  </Modal>
</template>

<style scoped>
.error_msg {
  @apply mx-[10%] text-rose-600;
}
.error_border {
  @apply border-2 border-rose-600;
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
