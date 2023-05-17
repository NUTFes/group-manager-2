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
  (e: 'reloadPurchase', v: null): void
}
const emits = defineEmits<Emits>()

const closeDeletePurchase = () => {
  emits('update:deletePurchase', false)
}

const reloadPurchase = () => {
  emits('reloadPurchase', null)
}

const deletePurchase = async () => {
  await useFetch(config.APIURL + "/purchase_lists/" + props.id, {
    method: "DELETE"
  })
  reloadPurchase()
  closeDeletePurchase()
}
</script>

<template>
  <Modal :title="$t('Purchase.deletePurchase')">
    <template #close>
      <div class="flex justify-end">
        <button @click="closeDeletePurchase()" class="hover:text-black hover:opacity-75">✖</button>
      </div>
    </template>
    <template #form>
      <div class="flex justify-around mx-8 mt-4">
        <RegistPageButton :text="$t('Button.return')" @click="closeDeletePurchase()"></RegistPageButton>
        <RegistPageButton :text="$t('Button.delete')" @click="deletePurchase()"></RegistPageButton>
      </div>
    </template>
  </Modal>
</template>
