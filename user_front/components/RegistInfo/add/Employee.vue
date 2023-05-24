<script lang="ts" setup>
import { useField, useForm } from 'vee-validate'
import { editEmployeeSchema } from '~/utils/validate'
const config = useRuntimeConfig()

const { meta, isSubmitting } = useForm({
  validationSchema: editEmployeeSchema,
})
const { handleChange: handleName, errorMessage: nameError } = useField('name')
const { handleChange: handleStudentId, errorMessage: studentIdError } = useField('studentId')

interface Props {
  groupId: number | null
}

interface Emits {
  (e: 'update:addEmployee', isAddEmployee: boolean): void
  (e: 'reloadEmployee', reload: null): void
}

const props = withDefaults(defineProps<Props>(), {
  groupId: null,
})

const emits = defineEmits<Emits>()

const reloadEmployee = () => {
  emits('reloadEmployee', null)
}

const newName = ref<string>()
const newStudentId = ref<string>()

const addEmployeeClose = () => {
  emits('update:addEmployee', false)
}

const addEmployee = async () => {
  await useFetch(config.APIURL + "/employees", {
    method: "POST",
    params: {
      group_id: props.groupId,
      name: newName.value,
      student_id: newStudentId.value,
      stool_test_id: 1
    },
  })
  reloadEmployee()
  addEmployeeClose()
};

const reset = () => {
  newName.value = ''
  newStudentId.value = ''
  handleName(newName.value)
  handleStudentId(newStudentId.value)
}

</script>

<template>
  <Modal :title="$t('Employees.addEmployees')">
    <template #close>
      <div class="flex justify-end">
        <button @click="addEmployeeClose()" class="hover:text-black hover:opacity-75">✖</button>
      </div>
    </template>
    <template #form>
      <div class="text">{{ $t('Employees.name') }}</div>
      <input class="entry" v-model="newName" @change="handleName" :class="{'error_border': nameError}">
      <div class="error_msg">{{ nameError }}</div>
      <div class="text">{{ $t('Employees.studentId') }}</div>
      <input class="entry" v-model="newStudentId" maxlength="8" @change="handleStudentId" :class="{'error_border': studentIdError}">
      <div class="error_msg">{{ studentIdError }}</div>
      <div class="flex justify-between mt-8 mx-8">
        <RegistPageButton :text="$t('Button.reset')" @click="reset()" />
        <RegistPageButton :disabled="!meta.valid || isSubmitting" :text="$t('Button.add')" @click="addEmployee()" />
      </div>
    </template>
  </Modal>
</template>

<style scoped>
.error_msg {
  @apply mx-[10%] text-rose-600
}
.error_border {
  @apply border-2 border-rose-600
}
.text {
  margin: 3% 10% 0%;
}

.entry {
  margin: 0% 10%;
  border: 1px solid silver;
  border-top: solid 1px #717171;
  border-bottom: solid 1px #e0e0e0;
  border-radius: 5px;
  background-color: white;
}
</style>
