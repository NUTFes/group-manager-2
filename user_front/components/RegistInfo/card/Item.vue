<script lang="ts" setup>

interface Props {
  groupId: string
  regist: string
  name: string
  num: number | null
  setting: boolean | null
}

const item = withDefaults(defineProps<Props>(), {
  groupId: '',
  regist: '',
  name: '',
  num: null,
  setting: null
})

const openEditItem = () => {
  isEditItem.value = true
}

const openDeleteItem = () => {
  isDeleteItem.value = true
}

const isEditItem = ref<boolean>(false)
const isDeleteItem = ref<boolean>(false)

</script>
<template>
  <RegistInfoNarrowCard>
    <template #body>
      <div class="absolute w-full mt-8 text-4xl font-[350] text-center">
        {{ item.name }}
      </div>
      <p class="absolute bottom-4 left-16 font-[350]">
        <span class="text-5xl">
          {{ item.num }}
        </span>
        <span class="text-2xl">個</span>
      </p>
    </template>
    <template #method>
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
  />
  <RegistInfoDeleteItem
    v-if="isDeleteItem"
    v-model:deleteItem="isDeleteItem" />
</template>
