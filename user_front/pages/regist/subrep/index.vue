<script lang="ts" setup>
import { loginCheck } from "@/utils/methods";
import { useField, useForm } from "vee-validate";
import { subRepSchema } from "~~/utils/validate";
import { gradeList, GradeWithDepartmentList } from "~~/utils/list";

const { meta, isSubmitting } = useForm({
  validationSchema: subRepSchema,
});

const { handleChange: handleName, errorMessage: nameError } = useField("name");
const { handleChange: handleStudentId, errorMessage: studentIdError } =
  useField("studentId");
const { handleChange: handleTel, errorMessage: telError } = useField("tel");
const { handleChange: handleMail, errorMessage: mailError } = useField("email");
const { handleChange: handleDepartmentId, errorMessage: departmentIdError } =
  useField("department");
const { handleChange: handleGradeId, errorMessage: gradeIdError } =
  useField("grade");

const registerParams = reactive({
  name: "",
  studentId: "",
  tel: "",
  mail: "",
  departmentId: "",
  gradeId: "",
  groupId: "",
  groupCategoryId: "",
});

const reset = () => {
  (registerParams.name = ""),
    (registerParams.studentId = ""),
    (registerParams.tel = ""),
    (registerParams.mail = ""),
    (registerParams.departmentId = ""),
    (registerParams.gradeId = ""),
    (registerParams.groupId = ""),
    (registerParams.groupCategoryId = "");
};

onMounted(async () => {
  // ログインしていない場合は/welcomeに遷移させる
  loginCheck();
  registerParams.groupId = localStorage.getItem("group_id") || "";
  registerParams.groupCategoryId =
    localStorage.getItem("group_category_id") || "";
});
const config = useRuntimeConfig();
const router = useRouter();
const registerSubRep = async () => {
  await $fetch(config.APIURL + "/sub_reps", {
    method: "POST",
    params: {
      name: registerParams.name,
      student_id: registerParams.studentId,
      tel: registerParams.tel,
      email: registerParams.mail,
      department_id: registerParams.departmentId,
      grade_id: registerParams.gradeId,
      group_id: registerParams.groupId,
    },
  });
  if (registerParams.groupCategoryId === "3") {
    router.push("/regist/stage/sunny");
  } else {
    router.push("/regist/place");
  }
};
const skip = () => {
  if (registerParams.groupCategoryId === "3") {
    router.push("/regist/stage/sunny");
  } else {
    router.push("/regist/place");
  }
};

const currentDepartmentList = ref<{ id: number; name: string }[]>([]);
const createCurrentDepartmentList = (e: any) => {
  currentDepartmentList.value = GradeWithDepartmentList.filter((grade) => {
    return grade.id === Number(e.target.value);
  })[0].departmentList;
};

const back = () => {
  router.push("/regist/group");
}
</script>

<template>
  <div>
    <div class="mx-[20%] my-[5%]">
      <Card>
        <h1 class="text-3xl">{{ $t("Subrep.registSubrepresentative") }}</h1>
        <Card border="none" align="end">
          <div class="flex">
            <p class="label">{{ $t("Subrep.name") }}</p>
            <input
              class="form"
              v-model="registerParams.name"
              @change="handleName"
              :class="{ error_border: nameError }"
            />
          </div>
          <div class="error_msg">{{ nameError }}</div>

          <div class="flex">
            <p class="label">{{ $t("Subrep.studentId") }}</p>
            <input
              class="form"
              v-model="registerParams.studentId"
              maxlength="8"
              @change="handleStudentId"
              :class="{ error_border: studentIdError }"
            />
          </div>
          <div class="error_msg">{{ studentIdError }}</div>

          <div class="flex">
            <p class="label">{{ $t("Subrep.grade") }}</p>
            <select
              style="width: 180px"
              v-model="registerParams.gradeId"
              @change="
                (e) => {
                  handleGradeId(e);
                  createCurrentDepartmentList(e);
                }
              "
              :class="{ 'border-rose-600': gradeIdError }"
            >
              <option value="" selected disabled></option>
              <option
                v-for="grade in gradeList"
                :key="grade.id"
                :value="grade.id"
              >
                {{ grade.name }}
              </option>
            </select>
          </div>
          <div class="error_msg">{{ gradeIdError }}</div>

          <div class="flex">
            <p class="label">{{ $t("Subrep.department") }}</p>
            <select
              style="width: 180px"
              v-model="registerParams.departmentId"
              @change="handleDepartmentId"
              :class="{ error_border: departmentIdError }"
            >
              <option value="" selected disabled></option>
              <option
                v-for="department in currentDepartmentList"
                :key="department.id"
                :value="department.id"
              >
                {{ department.name }}
              </option>
            </select>
          </div>
          <div class="error_msg">{{ departmentIdError }}</div>

          <div class="flex">
            <p class="label">{{ $t("Subrep.mail") }}</p>
            <input
              class="form"
              v-model="registerParams.mail"
              @change="handleMail"
              :class="{ error_border: mailError }"
            />
          </div>
          <div class="error_msg">{{ mailError }}</div>

          <div class="flex">
            <p class="label">{{ $t("Subrep.tel") }}</p>
            <input
              class="form"
              v-model="registerParams.tel"
              maxlength="11"
              @change="handleTel"
              :class="{ error_border: telError }"
            />
          </div>
          <div class="error_msg">{{ telError }}</div>
        </Card>
        <Row>
          <RegistPageButton
            :text="$t('Button.back')"
            variant="secondary"
            @click="back">
          </RegistPageButton>
          <RegistPageButton
            :text="$t('Button.reset')"
            @click="reset"
            variant="danger"
          ></RegistPageButton>
          <RegistPageButton
            :text="$t('Button.register')"
            :disabled="!meta.valid || isSubmitting"
            @click="registerSubRep"
          ></RegistPageButton>
          <RegistPageButton
            :text="$t('Button.skip')"
            @click="skip"
            variant="secondary"
          ></RegistPageButton>
        </Row>
      </Card>
    </div>
  </div>
</template>

<style scoped>
.error_msg {
  @apply text-rose-600;
}

.error_border {
  @apply border-2 border-rose-600;
}

.label {
  @apply flex-none text-xl pr-5;
}

.form {
  @apply flex-none border-solid border-2;
}
</style>
