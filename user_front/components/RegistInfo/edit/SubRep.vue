<script lang="ts" setup>
import { departmentList } from "~/utils/list";
import { gradeList } from "~/utils/list";

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
      <input class="entry" v-model="newName" />
      <div class="text">学科</div>
      <select class="entry" v-model="newDepartment">
        <option v-for="department in departmentList" :value="department.id" :key="department.id">
          {{ department.name }}
        </option>
      </select>
      <div class="text">学年</div>
      <select class="entry" v-model="newGrade">
        <option v-for="grade in gradeList" :value="grade.id" :key="grade.id">
          {{ grade.name }}
        </option>
      </select>
      <div class="text">電話番号</div>
      <input class="entry" v-model="newTel" />
      <div class="text">メールアドレス</div>
      <input class="entry" v-model="newEmail" />
      <div class="text">学籍番号</div>
      <input class="entry" v-model="newStudentId" />
      <div class="flex justify-between mt-8 mx-8">
        <RegistPageButton text="リセット" @click="reset()"></RegistPageButton>
        <RegistPageButton text="✓編集" @click="editSubRep()"></RegistPageButton>
      </div>
    </template>
  </Modal>
</template>

<style scoped>
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
