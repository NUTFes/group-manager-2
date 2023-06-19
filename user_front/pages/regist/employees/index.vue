<script lang="ts" setup>
import { loginCheck } from "@/utils/methods";
import { useFieldArray, useForm, Field, ErrorMessage } from "vee-validate";
import { employeeSchema } from "~~/utils/validate";

const initialData = {
  employees: [
    {
      name: "",
      studentId: "",
    },
  ],
};

const reset = (idx: number) => {
  (registerParams[idx].employeeName = ""), (registerParams[idx].studentId = "");
};

const { meta, isSubmitting } = useForm({
  validationSchema: employeeSchema,
  initialValues: initialData,
});

const {
  fields: employeeValidate,
  push: addValidate,
  remove: removeValidate,
} = useFieldArray("employees");

const config = useRuntimeConfig();
const router = useRouter();
const formCount = ref(1);

const state = reactive({
  groupId: 0,
  groupCategoryId: 0,
});

onMounted(async () => {
  // ログインしていない場合は/welcomeに遷移させる
  loginCheck();
  state.groupId = Number(localStorage.getItem("group_id"));
  state.groupCategoryId = Number(localStorage.getItem("group_category_id"));
});

const registerParams = [
  reactive({
    employeeName: "",
    studentId: "",
  }),
];

const increment = () => {
  formCount.value++;
  registerParams.push(
    reactive({
      employeeName: "",
      studentId: "",
    })
  );
  addValidate({ name: "", studentId: "" });
};

const decrement = (idx: number) => {
  formCount.value--;
  removeValidate(idx);
};

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

const skip = () => {
  if (state.groupCategoryId === 1 || state.groupCategoryId === 2) {
    router.push("/regist/food");
  } else {
    router.push("/mypage");
  }
};

const back = () => {
  router.push("/regist/power");
};
</script>

<template>
  <div class="mx-[20%] my-[5%]">
    <Card>
      <h1 class="text-3xl">{{ $t("Employees.registEmployees") }}</h1>
      <Card border="none" align="center">
        <div
          v-for="(field, idx) in employeeValidate"
          :key="field.key"
          class="border rounded-md p-2 flex flex-col gap-4 items-center"
        >
          <div class="grid grid-cols-2 gap-y-2">
            <p class="label">{{ $t("Employees.name") }}</p>
            <div class="flex flex-col">
              <Field
                class="form"
                :id="`employees[${idx}].name`"
                :name="`employees[${idx}].name`"
                v-model="registerParams[idx].employeeName"
              />
              <ErrorMessage
                class="text-rose-600 text-sm"
                :name="`employees[${idx}].name`"
              />
            </div>
            <p class="label">{{ $t("Employees.studentId") }}</p>
            <div class="flex flex-col">
              <Field
                :id="`employees[${idx}].studentId`"
                :name="`employees[${idx}].studentId`"
                class="form"
                v-model="registerParams[idx].studentId"
                maxlength="8"
              />
              <ErrorMessage
                class="text-rose-600 text-sm"
                :name="`employees[${idx}].studentId`"
              />
            </div>
          </div>
          <div v-if="idx == 0">
            <RegistPageButton
              :text="$t('Button.reset')"
              @click="reset(idx)"
              variant="danger"
            ></RegistPageButton>
          </div>
          <div v-if="idx != 0" class="flex gap-3">
            <RegistPageButton
              :text="$t('Button.reset')"
              @click="reset(idx)"
              variant="danger"
            ></RegistPageButton>
            <RegistPageButton
              :text="$t('Button.delete')"
              @click="decrement(idx)"
              variant="danger"
            ></RegistPageButton>
          </div>
        </div>
      </Card>
      <Row>
        <RegistPageButton
          :text="$t('Button.back')"
          @click="back"
          variant="secondary"
        ></RegistPageButton>
        <RegistPageButton
          :text="$t('Button.add')"
          @click="increment"
          variant="success"
        ></RegistPageButton>
        <RegistPageButton
          :text="$t('Button.register')"
          :disabled="!meta.valid || isSubmitting"
          @click="registerEmployee"
        ></RegistPageButton>
        <RegistPageButton
          :text="$t('Button.skip')"
          @click="skip"
          variant="secondary"
        ></RegistPageButton>
      </Row>
    </Card>
  </div>
</template>

<style scoped>
.label {
  @apply flex-none
      text-xl
      pr-5;
}
.form {
  @apply flex-none
    border-solid
    border-2;
}
</style>
