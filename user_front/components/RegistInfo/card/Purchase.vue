<script lang="ts" setup>
import { Setting } from '~~/types';

interface Props {
  id: number;
  groupId: number;
  foodProductId: number | null;
  foodProduct: string | null;
  shopId: number | null;
  shop: string | null;
  fesDateId: number | null;
  purchaseDate: string | null;
  url: string | null;
  name: string;
  isFresh: boolean;
  setting: boolean | null;
  groupCategoryId: number;
}
const purchase = withDefaults(defineProps<Props>(), {
  id: 0,
  groupId: 0,
  foodProductId: null,
  foodProduct: null,
  shopId: null,
  shop: null,
  fesDateId: null,
  purchaseDate: "",
  url: "",
  name: "",
  isFresh: false,
  setting: null,
  groupCategoryId: 0,
});

interface Emits {
  (e: "reloadPurchase", v: null): void;
}
const emits = defineEmits<Emits>();
const reloadPurchase = () => {
  emits("reloadPurchase", null);
};

const config = useRuntimeConfig();
const isEditPurchase = ref<boolean>();
onMounted(async()=>{
const setting = await $fetch<Setting>(config.APIURL+ "/user_page_settings") || null
  isEditPurchase.value = setting.data[0].is_edit_purchase_list
});

const isEditModal = ref<boolean>(false);
const openEditModal = () => {
  isEditModal.value = true
}
const isDeleteModal = ref<boolean>(false);
const openDeleteModal = () => {
  isDeleteModal.value = true
}
</script>

<template>
  <RegistInfoWideCard>
    <template #body>
      <div class="w-[10%] mx-4 text-center text-2xl">
        <span>{{ $t("Purchase.purchase") }}</span>
      </div>
      ▸
      <div class="w-[20%] ml-4 text-3xl text-center">
        <div class="flex justify-center">
          <div class="mr-1 my-1 text-xl truncate hover:text-clip">
            <span class="underline">{{ purchase.foodProduct }}</span
            >
          </div>
          <div class="mt-3 text-sm">の</div>
        </div>
        <div class="mr-1 truncate hover:text-clip">
          {{ purchase.name }}
        </div>
      </div>
      <RegistInfoDivideBar />
      <div class="w-[10%] text-center text-2xl">
        <span
          >{{ $t("Purchase.parchasePlace1") }}<br />{{
            $t("Purchase.parchasePlace2")
          }}</span
        >
      </div>
      ▸
      <div class="w-[20%] mx-4 text-2xl text-center">
        <div class="mr-1 text-center">
          {{ purchase.shop }}
        </div>
      </div>
      <RegistInfoDivideBar v-if="groupCategoryId === 1" />
      <div class="w-[10%] text-center mr-4" v-if="groupCategoryId === 1">
        <p class="text-3xl">
          {{ purchase.isFresh ? $t("Purchase.yes") : $t("Purchase.no") }}
        </p>
      </div>
    </template>
    <template v-if="isEditPurchase" #method>
      <div class="mx-4">
        <div class="my-2">
          <EditButton @click="openEditModal()" />
        </div>
        <DeleteButton @click="openDeleteModal()" />
      </div>
    </template>
  </RegistInfoWideCard>
  <RegistInfoEditPurchase
    v-if="isEditModal"
    v-model:edit-Purchase="isEditModal"
    :id="id"
    :group-id="groupId"
    :food-product-id="foodProductId"
    :food-product="foodProduct"
    :shop-id="shopId"
    :shop="shop"
    :fes-date-id="fesDateId"
    :purchase-date="purchaseDate"
    :url="url"
    :name="name"
    :is-fresh="isFresh"
    :group-category-id="groupCategoryId"
    @reload-purchase="reloadPurchase"
  />
  <RegistInfoDeletePurchase
    v-if="isDeleteModal"
    v-model:delete-Purchase="isDeleteModal"
    :id="id"
    @reload-purchase="reloadPurchase"
  />
</template>
