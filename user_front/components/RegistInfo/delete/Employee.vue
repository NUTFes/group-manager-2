<script lang="ts" setup>
const isShow = ref<boolean>()

interface Emits {
  (e: 'update:visible', visible: boolean): void
}

const emits = defineEmits<Emits>()

const modalClose = () => {
  emits('update:visible', false)
}
</script>

<template>
  <Modal v-model:visible="isShow" title="従業員申請の削除">
    <template #method>
      <div class="flex justify-around mx-8 mt-4">
        <ResetButton />
        <RegistButton @click="modalClose()" />
      </div>
    </template>
  </Modal>
</template>
