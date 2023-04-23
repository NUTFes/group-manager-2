<script lang="ts" setup>
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

interface Emits {
  (e: 'update:editEmployee', isEditEmployee: boolean): void
}

const emits = defineEmits<Emits>()

const closeEditEmployee = () => {
  emits('update:editEmployee', false)
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
      <input class="entry" v-model="newName">
      <div class="text">学籍番号</div>
      <input class="entry" v-model="newStudentId" />
      <div class="flex justify-between mt-8 mx-8">
        <RegistPageButton text="リセット" @click="reset()"></RegistPageButton>
        <RegistPageButton text="✓編集" @click="editEmployee()"></RegistPageButton>
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
