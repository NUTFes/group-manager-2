<script lang="ts" setup>

interface Props {
  id: number
  groupId: number
  foodProductId: number | null
  shopId: number | null
  fesDateId: number | null
  name: string
  isFresh: boolean
  setting: boolean | null
}

const purchase = withDefaults(defineProps<Props>(), {
  id: 0,
  groupId: 0,
  foodProductId: null,
  shopId: null,
  fesDateId: null,
  name: '',
  isFresh: false,
  setting: null,
})

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
        <span>購入品</span>
      </div>
      ▸
      <div class="w-[20%] ml-4 text-3xl text-center">
        <div class="mr-1 my-1 text-xl underline">
          {{ purchase.foodProductId }}の
        </div>
        <div class="mr-1">
          {{ purchase.name }}
        </div>
      </div>
      <RegistInfoDivideBar />
       <div class="w-[10%] text-center text-2xl">
          <span>購入<br>場所</span>
        </div>
      ▸
      <div class="w-[20%] mx-4 text-3xl text-center">
        <div class="mr-1 text-center">
          {{ purchase.shopId }}
        </div>
      </div>
      <RegistInfoDivideBar />
      <div class="w-[10%] text-center mr-4">
        <p class="text-3xl">{{ purchase.isFresh ? '生もの' : '加工品' }}</p>
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
    :shop-id="shopId"
    :fes-date-id="fesDateId"
    :name="name"
    :is-fresh="isFresh"
    :setting="setting"
  />
  <RegistInfoDeletePurchase
    v-if="isDeletePurchase"
    v-model:delete-Purchase="isDeletePurchase"
    :id="id"
    />
</template>
