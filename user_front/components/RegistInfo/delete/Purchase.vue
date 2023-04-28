<script lang="ts" setup>
const config = useRuntimeConfig()

interface Props {
  id: number | null
}
const props = withDefaults(defineProps<Props>(), {
  id: null
})

interface Emits {
  (e: 'update:deletePurchase', isDeletePurchase: boolean): void
}
const emits = defineEmits<Emits>()

const closeDeletePurchase = () => {
  emits('update:deletePurchase', false)
}

const deletePurchase = async () => {
  await useFetch(config.APIURL + "/purchase_lists/" + props.id, {
    method: "DELETE"
  })
  closeDeletePurchase()
}
</script>

<template>
  <Modal title="従業員申請の削除">
    <template #close>
      <div class="flex justify-end">
        <button @click="closeDeletePurchase()" class="hover:text-black hover:opacity-75">✖</button>
      </div>
    </template>
    <template #form>
      <div class="flex justify-around mx-8 mt-4">
        <RegistPageButton text="戻る" @click="closeDeletePurchase()"></RegistPageButton>
        <RegistPageButton text="✓削除" @click="deletePurchase()"></RegistPageButton>
      </div>
    </template>
  </Modal>
</template>
