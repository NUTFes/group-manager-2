<script lang="ts" setup>

interface Emits {
  (e: 'update:DeleteItem', visible: boolean): void
}
const emits = defineEmits<Emits>()

const closeDeleteItem = () => {
  emits('update:DeleteItem', false)
}

</script>

<template>
  <Modal title="貸出物品の削除">
    <template #close>
      <div class="flex justify-end">
        <button @click="closeDeleteItem()" class="hover:text-black hover:opacity-75"
        >✖</button>
      </div>
    </template>
    <template #form>
      <div class="flex justify-around mx-8 mt-4">
        <ResetButton />
        <RegistButton @click="closeDeleteItem()" />
      </div>
    </template>
  </Modal>
</template>
