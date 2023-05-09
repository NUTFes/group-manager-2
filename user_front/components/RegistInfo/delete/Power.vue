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
  <Modal title="電力申請の削除">
    <template #close>
      <div class="flex justify-end">
        <button @click="closeDeletePower()" class="hover:text-black hover:opacity-75">✖</button>
      </div>
    </template>
    <template #form>
      <div class="flex justify-around mx-8 mt-4">
        <RegistPageButton text="戻る" @click="closeDeletePower()"></RegistPageButton>
        <RegistPageButton text="✓削除" @click="deletePower()"></RegistPageButton>
      </div>
    </template>
  </Modal>
</template>
