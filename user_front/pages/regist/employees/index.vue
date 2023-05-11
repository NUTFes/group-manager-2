<script lang="ts" setup>
import { loginCheck } from '@/utils/methods'
import { useFieldArray, useForm, Field, ErrorMessage } from 'vee-validate'
import { employeeSchema } from '~~/utils/validate'

const initialData = {
  employees: [
    {
      name: '',
      studentId: '',
    },
  ],
};

const reset = (idx: number) => {
  registerParams[idx].employeeName = "",
  registerParams[idx].studentId = ""
}

const { meta, isSubmitting } = useForm({
  validationSchema: employeeSchema,
  initialValues: initialData,
});

const { fields: employeeValidate, push: addValidate, remove: removeValidate } = useFieldArray('employees')

const config = useRuntimeConfig();
const router = useRouter();
const formCount = ref(1);

const state = reactive({
  groupId: 0,
  groupCategoryId: 0,
});

onMounted(async () => {
  // ログインしていない場合は/welcomeに遷移させる
  loginCheck()
  state.groupId = Number(localStorage.getItem("group_id"));
  state.groupCategoryId = Number(localStorage.getItem("group_category_id"));
})

const registerParams = [reactive({
  employeeName: "",
  studentId: "",
})];

const increment = () => {
  formCount.value++
  registerParams.push(reactive({
    employeeName: "",
    studentId: "",
  }))
  addValidate({ name: '', studentId: '' })
}

const decrement = (idx: number) => {
  formCount.value--
  removeValidate(idx)
}

const registerEmployee = async () => {
  for (let i = 0; i < formCount.value; i++) {
    await $fetch(config.APIURL + "/employees", {
      method: "POST",
      params: {
        group_id: state.groupId,
        name: registerParams[i].employeeName,
        student_id: registerParams[i].studentId,
        stool_test_id: 1,
      },
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
  if (state.groupCategoryId === 1 || state.groupCategoryId === 2) {
    router.push("/regist/food");
  } else {
    router.push("/mypage");
  }
};

const skip = () =>{
  if (state.groupCategoryId === 1 || state.groupCategoryId === 2) {
    router.push("/regist/food");
  } else {
    router.push("/mypage");
  }
}

</script>

<template>
  <div class="mx-[20%] my-[5%]">
    <Card>
      <h1 class="text-3xl">Registration of employees</h1>
      <Card border="none" align="end">
        <div v-for="(field, idx) in employeeValidate" :key="field.key">
          <div class="flex">
            <p class="label">name</p>
            <Field class="form"
              :id="`employees[${idx}].name`"
              :name="`employees[${idx}].name`"
              v-model="registerParams[idx].employeeName"
            />
          </div>
          <ErrorMessage class="text-rose-600" :name="`employees[${idx}].name`" />

          <div class="flex">
            <p class="label">student id</p>
            <Field
              :id="`employees[${idx}].studentId`"
              :name="`employees[${idx}].studentId`"
              class="form"
              v-model="registerParams[idx].studentId"
              maxlength="8"
            />
          </div>
          <ErrorMessage class="text-rose-600" :name="`employees[${idx}].studentId`" />

          <div v-if="idx == 0">
            <RegistPageButton text="reset" @click="reset(idx)"></RegistPageButton>
          </div>

          <div v-if="idx != 0" class="flex gap-3">
            <RegistPageButton text="reset" @click="reset(idx)"></RegistPageButton>
            <RegistPageButton text="remove" @click="decrement(idx)"></RegistPageButton>
          </div>
        </div>
      </Card>
      <Row>
        <RegistPageButton text="register" :disabled="!meta.valid || isSubmitting" @click="registerEmployee"></RegistPageButton>
        <RegistPageButton text="Add" @click="increment"></RegistPageButton>
        <RegistPageButton text="skip" @click="skip"></RegistPageButton>
      </Row>
    </Card>
  </div>
</template>

<style scoped>
  .label {
    @apply
      flex-none
      text-xl
      pr-5
  }
  .form {
    @apply
    flex-none
    border-solid
    border-2
  }
</style>
