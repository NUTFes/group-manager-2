<script lang="ts" setup>
const config = useRuntimeConfig()

interface Props {
  id: number | null
}
interface Emits {
  (e: 'update:DeletePower', isDeletePower: boolean): void
}

const props = withDefaults(defineProps<Props>(), {
  id: null
})
const emits = defineEmits<Emits>()

const closeDeletePower = () => {
  emits('update:DeletePower', false)
}

const deletePower = async() => {
  await useFetch(config.APIURL + "/power_orders/" + props.id, {
    method: 'DELETE'
  })
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
        <RegistPageButton text="reset"></RegistPageButton>
        <RegistPageButton text="register" @click="deletePower()"></RegistPageButton>
      </div>
    </template>
  </Modal>
</template>
