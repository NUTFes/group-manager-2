<script lang="ts" setup>

interface Props {
  id: number
  groupId: number
  foodProductId: number | null
  foodProduct: string | null
  shopId: number | null
  shop: string | null
  fesDateId: number | null
  name: string
  isFresh: boolean
  setting: boolean | null
}
const purchase = withDefaults(defineProps<Props>(), {
  id: 0,
  groupId: 0,
  foodProductId: null,
  foodProduct: null,
  shopId: null,
  shop: null,
  fesDateId: null,
  name: '',
  isFresh: false,
  setting: null,
})

interface Emits {
  (e: 'reloadPurchase', v: null): void
}
const emits = defineEmits<Emits>()
const reloadPurchase = () => {
  emits('reloadPurchase', null)
}

const isEditPurchase = ref<boolean>(false)
const isDeletePurchase = ref<boolean>(false)

const openEditPurchase = () => {
  isEditPurchase.value = true
}
const openDeletePurchase = () => {
  isDeletePurchase.value = true
}

</script>
<template>
  <RegistInfoWideCard>
    <template #body>
      <div class="w-[10%] mx-4 text-center text-2xl">
        <span>{{ $t('Purchase.purchase') }}</span>
      </div>
      ▸
      <div class="w-[20%] ml-4 text-3xl text-center">
        <div class="mr-1 my-1 text-xl">
          <span class="underline">{{ purchase.foodProduct }}</span>の
        </div>
        <div class="mr-1">
          {{ purchase.name }}
        </div>
      </div>
      <RegistInfoDivideBar />
       <div class="w-[10%] text-center text-2xl">
          <span>{{ $t('Purchase.parchasePlace1') }}<br>{{ $t('Purchase.parchasePlace2') }}</span>
        </div>
      ▸
      <div class="w-[20%] mx-4 text-3xl text-center">
        <div class="mr-1 text-center">
          {{ purchase.shop }}
        </div>
      </div>
      <RegistInfoDivideBar />
      <div class="w-[10%] text-center mr-4">
        <p class="text-3xl">{{ purchase.isFresh ? $t('Purchase.yes') : $t('Purchase.no') }}</p>
      </div>
    </template>
    <template #method>
      <div class="mx-4">
        <div class="my-2">
          <EditButton @click="openEditPurchase()" />
        </div>
        <DeleteButton @click="openDeletePurchase()" />
      </div>
    </template>
  </RegistInfoWideCard>
  <RegistInfoEditPurchase
    v-if="isEditPurchase"
    v-model:edit-Purchase="isEditPurchase"
    :id="id"
    :group-id="groupId"
    :food-product-id="foodProductId"
    :food-product="foodProduct"
    :shop-id="shopId"
    :shop="shop"
    :fes-date-id="fesDateId"
    :name="name"
    :is-fresh="isFresh"
    @reload-purchase="reloadPurchase"
  />
  <RegistInfoDeletePurchase
    v-if="isDeletePurchase"
    v-model:delete-Purchase="isDeletePurchase"
    :id="id"
    @reload-purchase="reloadPurchase"
    />
</template>
