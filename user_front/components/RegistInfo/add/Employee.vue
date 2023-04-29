<script lang="ts" setup>
const config = useRuntimeConfig()

interface Props {
  groupId: number | null
}

interface Emits {
  (e: 'update:addEmployee', isAddEmployee: boolean): void
}

const props = withDefaults(defineProps<Props>(), {
  groupId: null,
})

const emits = defineEmits<Emits>()

// onMounted(async () => {
//   const employeeData = await $fetch<employee>(config.APIURL + "/api/v1/get_stage_rentable_employees");
//   employeeData.data.forEach((employee) => {
//     employeeList.value.push(employee);
//   });
// })

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
  addEmployeeClose()
};

const reset = () => {
  newName.value = ''
  newStudentId.value = ''
}

</script>

<template>
  <Modal title="従業員の追加">
    <template #close>
      <div class="flex justify-end">
        <button @click="addEmployeeClose()" class="hover:text-black hover:opacity-75">✖</button>
      </div>
    </template>
    <template #form>
      <div class="text">氏名</div>
      <input class="entry" v-model="newName">
      <div class="text">学籍番号</div>
      <input class="entry" v-model="newStudentId">
      <div class="flex justify-between mt-8 mx-8">
        <RegistPageButton text="リセット" @click="reset()" />
        <RegistPageButton text="✓追加" @click="addEmployee()" />
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
