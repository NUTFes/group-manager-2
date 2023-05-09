<script lang="ts" setup>
const config = useRuntimeConfig()

interface Props {
  id: number | null
}

const props = withDefaults(defineProps<Props>(), {
  id: null
})

interface Emits {
  (e: 'update:deleteItem', isDeleteItem: boolean): void
  (e: 'reloadItem', v: null): void
}
const emits = defineEmits<Emits>()

const closeDeleteItem = () => {
  emits('update:deleteItem', false)
}

const reloadItem = () => {
  emits('reloadItem', null)
}

const deleteItem = async() => {
  await useFetch(config.APIURL + "/rental_orders/" + props.id, {
    method: "DELETE"
  })
  reloadItem()
  closeDeleteItem()
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
          <RegistPageButton text="戻る" @click="closeDeleteItem()"></RegistPageButton>
          <RegistPageButton text="✓削除" @click="deleteItem()"></RegistPageButton>
      </div>
    </template>
  </Modal>
</template>
