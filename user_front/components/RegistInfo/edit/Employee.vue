<script lang="ts" setup>
import { useField, useForm } from 'vee-validate';
import { editEmployeeSchema } from '~~/utils/validate';
const config = useRuntimeConfig();

interface Regist {
  groupId: number | null
  id: number | null
  name: string
  studentId: number | null
}

const props = withDefaults(defineProps<Regist>(), {
  groupId: null,
  id: null,
  name: '',
  studentId: null
})

const {meta, isSubmitting} = useForm({
  validationSchema: editEmployeeSchema,
  initialValues: {
    name: props.name,
    studentId: props.studentId
  }
})
const { handleChange: handleName, errorMessage: nameError } = useField('name')
const { handleChange: handleStudentId, errorMessage: studentIdError } = useField('studentId')

interface Emits {
  (e: 'update:editEmployee', isEditEmployee: boolean): void
  (e: 'reloadEmployee', v: null): void
}

const emits = defineEmits<Emits>()

const closeEditEmployee = () => {
  emits('update:editEmployee', false)
}

const reloadEmployee = () => {
  emits('reloadEmployee', null)
}

const newName = ref<string>(props.name)
const newStudentId = ref<number | null>(props.studentId)

const editEmployee = async () => {
  await useFetch(config.APIURL + "/employees/" + props.id, {
    method: "PUT",
    params: {
      group_id: props.groupId,
      name: newName.value,
      student_id: newStudentId.value,
      stool_test_id: 1
    },
  })
  reloadEmployee()
  closeEditEmployee()
};

const reset = () => {
  newName.value = ''
  newStudentId.value = null
}

</script>

<template>
  <Modal title="従業員申請の編集">
    <template #close>
      <div class="flex justify-end">
        <button @click="closeEditEmployee()" class="hover:text-black hover:opacity-75">✖</button>
      </div>
    </template>
    <template #form>
      <div class="text">氏名</div>
      <input class="entry" v-model="newName" @change="handleName" :class="{'error_border': nameError}">
      <div class="error_msg">{{ nameError }}</div>
      <div class="text">学籍番号</div>
      <input class="entry" v-model="newStudentId" maxlength="8" @change="handleStudentId" :class="{'error_border': studentIdError}" />
      <div class="error_msg">{{ studentIdError }}</div>
      <div class="flex justify-between mt-8 mx-8">
        <RegistPageButton text="リセット" @click="reset()"></RegistPageButton>
        <RegistPageButton :disabled="!meta.valid || isSubmitting" text="✓編集" @click="editEmployee()"></RegistPageButton>
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
