<script lang="ts" setup>
const config = useRuntimeConfig()

interface Props {
  id: number | null
}

const props = withDefaults(defineProps<Props>(), {
  id: null
})

interface Emits {
  (e: 'update:deleteFood', isDeleteFood: boolean): void
  (e: 'reloadFood', v: null): void
}
const emits = defineEmits<Emits>()

const closeDeleteFood = () => {
  emits('update:deleteFood', false)
}

const reloadFood = () => {
  emits('reloadFood', null)
}

const deleteFood = async () => {
  await useFetch(config.APIURL + "/food_products/" + props.id, {
    method: "DELETE"
  })
  reloadFood()
  closeDeleteFood()
}

</script>

<template>
  <Modal :title="$t('Product.deleteProduct')">
    <template #close>
      <div class="flex justify-end">
        <button @click="closeDeleteFood()" class="hover:text-black hover:opacity-75">✖</button>
      </div>
    </template>
    <template #form>
      <div class="flex justify-around mx-8 mt-4">
        <RegistPageButton :text="$t('Button.return')" @click="closeDeleteFood()"></RegistPageButton>
        <RegistPageButton :text="$t('Button.delete')" @click="deleteFood()"></RegistPageButton>
      </div>
    </template>
  </Modal>
</template>
