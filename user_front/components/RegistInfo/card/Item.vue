<script lang="ts" setup>

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
  setting: null
})

const isEditItem = ref<boolean>(false)
const isDeleteItem = ref<boolean>(false)

const openEditItem = () => {
  isEditItem.value = true
}
const openDeleteItem = () => {
  isDeleteItem.value = true
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
        <span class="text-2xl">個</span>
      </div>
      <div class="absolute right-4 bottom-2">
        <div class="my-2">
          <EditButton @click="openEditItem()" />
        </div>
      <DeleteButton @click="openDeleteItem()" />
      </div>
    </template>
  </RegistInfoNarrowCard>
  <RegistInfoEditItem
    v-if="isEditItem"
    v-model:edit-item="isEditItem"
    :group-id="groupId"
    :id="regist?.id"
    :item="regist?.rental_item_id"
    :num="regist?.num"
    @reload-item="reloadItem"
  />
  <RegistInfoDeleteItem
    v-if="isDeleteItem"
    v-model:delete-item="isDeleteItem"
    :id="regist?.id"
    @reload-item="reloadItem"
  />
</template>
