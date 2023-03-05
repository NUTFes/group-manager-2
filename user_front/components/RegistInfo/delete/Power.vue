<script lang="ts" setup>

interface Emits {
  (e: 'update:DeletePower', isDeletePower: boolean): void
}
const emits = defineEmits<Emits>()

const closeDeletePower = () => {
  emits('update:DeletePower', false)
}

</script>

<template>
  <Modal title="電力申請の削除">
    <template #close>
      <div class="flex justify-end">
        <button @click="closeDeletePower()" class="hover:text-black hover:opacity-75">✖</button>
      </div>
    </template>
    <template #form>
      <div class="flex justify-around mx-8 mt-4">
        <ResetButton />
        <RegistButton @click="closeDeletePower()" />
      </div>
    </template>
  </Modal>
</template>
