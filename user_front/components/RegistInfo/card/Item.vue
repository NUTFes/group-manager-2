<script lang="ts" setup>
import { Setting } from '~~/types'

interface Regist {
  id: number
  rental_item_id: number
  num: number
}

interface Props {
  groupId: number
  regist: Regist | null
  name: string
  num: number
  setting: boolean | null
  rentalItemIds: number[] | null
}

interface Emits {
  (e: 'reloadItem', v: null): void
}
const emits = defineEmits<Emits>()
const reloadItem = () => {
  emits('reloadItem', null)
}

const item = withDefaults(defineProps<Props>(), {
  groupId: 0,
  regist: null,
  name: '',
  num: 0,
  setting: null,
  rentalItemIds: null
})

const config = useRuntimeConfig();
const isEditItem = ref<boolean>();
onMounted(async()=>{
const setting = await $fetch<Setting>(config.APIURL+ "/user_page_settings") || null
  isEditItem.value = setting.data[0].is_edit_rental_order
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
  <RegistInfoNarrowCard>
    <template #body>
      <div class="absolute w-full mt-8 text-4xl font-[350] text-center">
        {{ item.name }}
      </div>
      <div class="absolute bottom-4 left-16 font-[350]">
        <span class="text-5xl">
          {{ item.num }}
        </span>
        <span class="text-2xl">{{ $t('Item.count') }}</span>
      </div>
      <div v-if="isEditItem" class="absolute right-4 bottom-2">
        <div class="my-2">
          <EditButton @click="openEditModal()" />
        </div>
        <DeleteButton @click="openDeleteModal()" />
      </div>
    </template>
  </RegistInfoNarrowCard>
  <RegistInfoEditItem
    v-if="isEditModal"
    v-model:edit-item="isEditModal"
    :group-id="groupId"
    :id="regist?.id"
    :item="regist?.rental_item_id"
    :num="regist?.num"
    :rental-item-ids="rentalItemIds"
    @reload-item="reloadItem"
  />
  <RegistInfoDeleteItem
    v-if="isDeleteModal"
    v-model:delete-item="isDeleteModal"
    :id="regist?.id"
    @reload-item="reloadItem"
  />
</template>
