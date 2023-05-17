<script lang="ts" setup>
const config = useRuntimeConfig()

interface Props {
  id: number | null
}
interface Emits {
  (e: 'update:deletePower', isDeletePower: boolean): void
  (e: 'reloadPower', v: null): void
}

const props = withDefaults(defineProps<Props>(), {
  id: null
})
const emits = defineEmits<Emits>()

const closeDeletePower = () => {
  emits('update:deletePower', false)
}

const reloadPower = () => {
  emits('reloadPower', null)
}

const deletePower = async() => {
  await useFetch(config.APIURL + "/power_orders/" + props.id, {
    method: 'DELETE'
  })
  reloadPower()
  closeDeletePower()
}

</script>

<template>
  <Modal :title="$t('Power.deletePower')">
    <template #close>
      <div class="flex justify-end">
        <button @click="closeDeletePower()" class="hover:text-black hover:opacity-75">✖</button>
      </div>
    </template>
    <template #form>
      <div class="flex justify-around mx-8 mt-4">
        <RegistPageButton :text="$t('Button.return')" @click="closeDeletePower()"></RegistPageButton>
        <RegistPageButton :text="$t('Button.delete')" @click="deletePower()"></RegistPageButton>
      </div>
    </template>
  </Modal>
</template>
