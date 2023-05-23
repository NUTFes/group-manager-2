<script lang="ts" setup>
import { Purchase } from "~~/types";
import { FoodProduct, FesDate, Date } from "~~/types/mypage/registAlarm";
import { useField, useForm } from "vee-validate";
import { editPurchaseSchema } from "~~/utils/validate";
const config = useRuntimeConfig();

const { meta, isSubmitting } = useForm({
  validationSchema: editPurchaseSchema,
});
const { handleChange: handleFoodProductId, errorMessage: foodProductIdError } =
  useField("foodProductId");
const { handleChange: handleShopId, errorMessage: shopIdError } =
  useField("shopId");
const { handleChange: handleItem, errorMessage: itemError } = useField("item");
const { handleChange: handleFesDateId, errorMessage: fesDateIdError } =
  useField("fesDateId");

interface Props {
  groupId: number | null;
}
const props = withDefaults(defineProps<Props>(), {
  groupId: null,
});

interface Emits {
  (e: "update:addPurchase", isAddPurchase: boolean): void;
  (e: "reloadPurchase", v: null): void;
}
const emits = defineEmits<Emits>();

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

const newFoodProductId = ref<number | null>(null);
const newShopId = ref<number | null>(null);
const newFesDateId = ref<number | null>(null);
const newIsFresh = ref<boolean>(false);
const newItems = ref<string>("");

const addPurchaseClose = () => {
  emits("update:addPurchase", false);
};

const reloadPurchase = () => {
  emits("reloadPurchase", null);
};

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
  });
  reloadPurchase();
  addPurchaseClose();
};

const reset = () => {
  newFoodProductId.value = null;
  newShopId.value = null;
  newFesDateId.value = null;
  newIsFresh.value = false;
};
</script>

<template>
  <Modal :title="$t('Purchase.addPurchase')">
    <template #close>
      <div class="flex justify-end">
        <button
          @click="addPurchaseClose()"
          class="hover:text-black hover:opacity-75"
        >
          ✖
        </button>
      </div>
    </template>
    <template #form>
      <div class="text">{{ $t("Purchase.target") }}</div>
      <select
        class="entry"
        v-model="newFoodProductId"
        @change="handleFoodProductId"
        :class="{ error_border: foodProductIdError }"
      >
        <option value="" disabled selected>{{ $t("Purchase.select") }}</option>
        <option v-for="(list, i) in foodProducts" :key="i" :value="list.id">
          {{ list.name }}
        </option>
      </select>
      <div class="error_msg">{{ foodProductIdError }}</div>
      <div class="text">{{ $t("Purchase.name") }}</div>
      <input
        class="entry"
        type="text"
        v-model="newItems"
        @change="handleItem"
        :class="{ error_border: itemError }"
      />
      <div class="error_msg">{{ itemError }}</div>
      <div class="text">{{ $t("Purchase.rowFood") }}</div>
      <select class="entry" v-model="newIsFresh">
        <option value="" disabled selected>{{ $t("Purchase.select") }}</option>
        <option value="true">{{ $t("Purchase.yes") }}</option>
        <option value="false">{{ $t("Purchase.no") }}</option>
      </select>
      <div class="text">{{ $t("Purchase.place") }}</div>
      <select
        class="entry"
        v-model="newShopId"
        @change="handleShopId"
        :class="{ error_border: shopIdError }"
      >
        <option value="" disabled selected>{{ $t("Purchase.select") }}</option>
        <option v-for="(list, i) in purchases" :key="i" :value="list.id">
          {{ list.name }}
        </option>
      </select>
      <div class="error_msg">{{ shopIdError }}</div>
      <div class="text">{{ $t("Purchase.date") }}</div>
      <select
        class="entry"
        v-model="newFesDateId"
        @change="handleFesDateId"
        :class="{ error_border: fesDateIdError }"
      >
        <option value="" disabled selected>{{ $t("Purchase.select") }}</option>
        <option v-for="dates in fesDates" :key="dates.id" :value="dates.id">
          {{ dates.date }}
        </option>
      </select>
      <div class="error_msg">{{ fesDateIdError }}</div>
      <div class="flex justify-between mt-8 mx-8">
        <RegistPageButton :text="$t('Button.reset')" @click="reset()" />
        <RegistPageButton
          :disabled="!meta.valid || isSubmitting"
          :text="$t('Button.add')"
          @click="addPurchase()"
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
