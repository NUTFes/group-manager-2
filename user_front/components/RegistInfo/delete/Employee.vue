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
  (e: 'reloadEmployee', v: null): void
}
const emits = defineEmits<Emits>()

const closeDeleteEmployee = () => {
  emits('update:deleteEmployee', false)
}

const reloadEmployee = () => {
  emits('reloadEmployee', null)
}

const deleteEmployee = async () => {
  await useFetch(config.APIURL + "/employees/" + props.id, {
    method: "DELETE"
  })
  reloadEmployee()
  closeDeleteEmployee()
}

</script>

<template>
  <Modal :title="$t('Employees.deleteEmployees')">
    <template #close>
      <div class="flex justify-end">
        <button @click="closeDeleteEmployee()" class="hover:text-black hover:opacity-75"
        >✖</button>
      </div>
    </template>
    <template #form>
      <div class="flex justify-around mx-8 mt-4">
        <RegistPageButton :text="$t('Button.return')" @click="closeDeleteEmployee()"></RegistPageButton>
        <RegistPageButton :text="$t('Button.delete')" @click="deleteEmployee()"></RegistPageButton>
      </div>
    </template>
  </Modal>
</template>
