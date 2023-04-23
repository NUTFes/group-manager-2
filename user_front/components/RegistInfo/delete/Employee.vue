<script lang="ts" setup>
const config = useRuntimeConfig()

interface Props {
  id: number | null
}

const props = withDefaults(defineProps<Props>(), {
  id: null
})

interface Emits {
  (e: 'update:deleteEmployee', isDeleteEmployee: boolean): void
}
const emits = defineEmits<Emits>()

const closeDeleteEmployee = () => {
  emits('update:deleteEmployee', false)
}

const deleteEmployee = async () => {
  await useFetch(config.APIURL + "/employees/" + props.id, {
    method: "DELETE"
  })
  closeDeleteEmployee()
}

</script>

<template>
  <Modal title="従業員申請の削除">
    <template #close>
      <div class="flex justify-end">
        <button @click="closeDeleteEmployee()" class="hover:text-black hover:opacity-75"
        >✖</button>
      </div>
    </template>
    <template #form>
      <div class="flex justify-around mx-8 mt-4">
        <RegistPageButton text="戻る" @click="closeDeleteEmployee()"></RegistPageButton>
        <RegistPageButton text="✓削除" @click="deleteEmployee()"></RegistPageButton>
      </div>
    </template>
  </Modal>
</template>
