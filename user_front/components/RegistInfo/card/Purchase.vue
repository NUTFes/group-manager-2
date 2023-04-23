<script lang="ts" setup>

interface Props {
  groupId: number
  name: string
  isFresh: boolean
  firstNum: number
  secondNum: number
  setting: boolean | null
}

const food = withDefaults(defineProps<Props>(), {
  groupId: 0,
  name: '',
  isFresh: false,
  firstNum: 0,
  secondNum: 0,
  setting: null,
})

const isEditFood = ref<boolean>(false)
const isDeleteFood = ref<boolean>(false)

const openEditFood = () => {
  isEditFood.value = true
}
const openDeleteFood = () => {
  isDeleteFood.value = true
}

</script>
<template>
  <RegistInfoWideCard>
    <template #body>
      <div class="mx-8 text-center text-3xl">
        <span>購入品</span>
      </div>
      ▶
      <div class="mx-4 text-2xl text-center">
        <div class="mr-1 my-1">
          ああああの
        </div>
        <div class="mr-1">
          トマト
        </div>
      </div>
      <RegistInfoDivideBar />
       <div class="mx-8 text-center text-2xl">
          <span>購入<br>場所</span>
        </div>
      ▶
      <div class="mx-4 text-2xl text-center">
        <div class="mr-1 text-center">
          業務スーパー中塚店
        </div>
      </div>
      <RegistInfoDivideBar />
      <div class="w-[10%] text-center mr-4">
        <p class="text-3xl">{{ food.isFresh ? '生もの' : '加工品' }}</p>
      </div>
    </template>
    <template #method>
      <div class="mx-8">
        <div class="my-2">
          <EditButton @click="openEditFood()" />
        </div>
        <DeleteButton @click="openDeleteFood()" />
      </div>
    </template>
  </RegistInfoWideCard>
  <!-- <RegistInfoEditItem
      v-if="isEditItem"
      v-model:edit-item="isEditItem"
      :group-id="groupId"
      :id="regist?.id"
      :item="regist?.rental_item_id"
      :num="regist?.num"
    />
    <RegistInfoDeleteItem
      v-if="isDeleteItem"
      v-model:delete-item="isDeleteItem"
      :id="regist?.id"
    /> -->
</template>
