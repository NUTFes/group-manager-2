<script lang="ts" setup>
const config = useRuntimeConfig()

interface Props {
  id: number | null
}

const props = withDefaults(defineProps<Props>(), {
  id: null
})

interface Emits {
  (e: 'update:DeleteItem', isDeleteItem: boolean): void
}
const emits = defineEmits<Emits>()

const closeDeleteItem = () => {
  emits('update:DeleteItem', false)
}

const deleteItem = async() => {
  await useFetch(config.APIURL + "/rental_orders/" + props.id, {
    method: "DELETE"
  })
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
          <RegistPageButton text="reset"></RegistPageButton>
          <RegistPageButton text="register" @click="deleteItem()"></RegistPageButton>
      </div>
    </template>
  </Modal>
</template>
