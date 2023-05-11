<script lang="ts" setup>
import { departmentList } from "~/utils/list";
import { gradeList } from "~/utils/list";
import { useField, useForm } from "vee-validate";
import { subRepSchema } from "~/utils/validate";
const config = useRuntimeConfig();

interface Props {
  id: number | null
  groupId: number | null
  name: string
  department_id: number | null
  grade_id: number | null
  tel: string
  email: string
  student_id: number | null
}
const props = withDefaults(defineProps<Props>(), {
  id: null,
  groupId: null,
  name: '',
  department_id: null,
  grade_id: null,
  tel: '',
  email: '',
  student_id: null,
})

const { meta, isSubmitting } = useForm({
  validationSchema: subRepSchema,
  initialValues: {
    name: props.name,
    studentId: props.student_id,
    tel: props.tel,
    email: props.email,
    department: props.department_id,
    grade: props.grade_id,
  }
});
const { handleChange: handleName, errorMessage: nameError } = useField("name");
const { handleChange: handleStudentId, errorMessage: studentIdError } = useField("studentId");
const { handleChange: handleTel, errorMessage: telError } = useField("tel");
const { handleChange: handleMail, errorMessage: mailError } = useField("email");
const { handleChange: handleDepartmentId, errorMessage: departmentIdError } = useField("department");
const { handleChange: handleGradeId, errorMessage: gradeIdError } = useField("grade");

interface Emits {
  (e: 'update:editSubRep', isEditSubRep: boolean): void
  (e: 'reloadSubRep', v: null): void
}
const emits = defineEmits<Emits>()
const closeEditSubRep = () => {
  emits('update:editSubRep', false)
}
const reloadSubRep = () => {
  emits('reloadSubRep', null)
}

const newName = ref<Props['name']>(props.name)
const newDepartment = ref<Props['department_id']>(props.department_id)
const newGrade = ref<Props['grade_id']>(props.grade_id)
const newTel = ref<Props['tel']>(props.tel)
const newEmail = ref<Props['email']>(props.email)
const newStudentId = ref<Props['student_id']>(props.student_id)
// const newSetting = ref<boolean>()

const editSubRep = async () => {
  await useFetch(config.APIURL + "/sub_reps/" + props.id, {
    method: "PUT",
    params: {
      group_id: props.groupId,
      name: newName.value,
      department_id: newDepartment.value,
      grade_id: newGrade.value,
      tel: newTel.value,
      email: newEmail.value,
      student_id: newStudentId.value,
    },
  })
  reloadSubRep()
  closeEditSubRep()
};

const reset = () => {
  newName.value = ''
  newDepartment.value = null
  newGrade.value = null
  newTel.value = ''
  newEmail.value = ''
  newStudentId.value = null
}
</script>

<template>
  <Modal title="副代表の編集">
    <template #close>
      <div class="flex justify-end">
        <button @click="closeEditSubRep()" class="hover:text-black hover:opacity-75">✖</button>
      </div>
    </template>
    <template #form>
      <div class="text">名前</div>
      <input class="entry" v-model="newName" @change="handleName" :class="{'error_border': nameError}" />
      <div class="error_msg">{{ nameError }}</div>
      <div class="text">学籍番号</div>
      <input class="entry" v-model="newStudentId" maxlength="8" @change="handleStudentId" :class="{'error_border': studentIdError }" />
      <div class="error_msg">{{ studentIdError }}</div>
      <div class="text">学科</div>
      <select class="entry" v-model="newDepartment" @change="handleDepartmentId" :class="{ 'error_border': departmentIdError }">
        <option v-for="department in departmentList" :value="department.id" :key="department.id">
          {{ department.name }}
        </option>
      </select>
      <div class="error_msg">{{ departmentIdError }}</div>
      <div class="text">学年</div>
      <select class="entry" v-model="newGrade" @change="handleGradeId" :class="{ 'error_border': gradeIdError }">
        <option v-for="grade in gradeList" :value="grade.id" :key="grade.id">
          {{ grade.name }}
        </option>
      </select>
      <div class="error_msg">{{ gradeIdError }}</div>
      <div class="text">メールアドレス</div>
      <input class="entry" v-model="newEmail" @change="handleMail" :class="{ 'error_border': mailError }" />
      <div class="error_msg">{{ mailError }}</div>
      <div class="text">電話番号</div>
      <input class="entry" v-model="newTel" @change="handleTel" maxlength="11" :class="{ 'error_border': telError }" />
      <div class="error_msg">{{ telError }}</div>
      <div class="flex justify-between mt-8 mx-8">
        <RegistPageButton text="リセット" @click="reset()"></RegistPageButton>
        <RegistPageButton :disabled="!meta.valid || isSubmitting" text="✓編集" @click="editSubRep()"></RegistPageButton>
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
