<script lang="ts" setup>
import axios from "axios";
import { User, RegisterParams } from "@/types/regist/user";
import { Setting } from "@/types";
import { useForm, useField } from "vee-validate";
import { userSchema } from "~~/utils/validate";
import { gradeList, GradeWithDepartmentList } from "~/utils/list";

const { meta, isSubmitting } = useForm({
  validationSchema: userSchema,
});

const { handleChange: handleName, errorMessage: nameError } = useField("name");
const { handleChange: handleDepartment, errorMessage: departmentError } =
  useField("department");
const { handleChange: handleGrade, errorMessage: gradeError } =
  useField("grade");
const { handleChange: handleStudentId, errorMessage: studentIdError } =
  useField("studentId");
const { handleChange: handlePassword, errorMessage: passwordError } =
  useField("password");
const {
  handleChange: handlePasswordConfirm,
  errorMessage: passwordConfirmError,
} = useField("passwordConfirm");
const { handleChange: handleEmail, errorMessage: emailError } =
  useField("email");
const { handleChange: handleTel, errorMessage: telError } = useField("tel");

//v-modelで渡すparamsの定義
const registerParams = reactive<RegisterParams>({
  name: "",
  studentId: "",
  tel: "",
  mail: "",
  password: "",
  passwordConfirm: "",
  departmentId: null,
  gradeId: null,
  userId: 0,
});

const reset = () => {
  (registerParams.name = ""),
    (registerParams.studentId = ""),
    (registerParams.tel = ""),
    (registerParams.mail = ""),
    (registerParams.password = ""),
    (registerParams.passwordConfirm = ""),
    (registerParams.departmentId = null),
    (registerParams.gradeId = null),
    (registerParams.userId = 0);
};

const config = useRuntimeConfig();
const router = useRouter();

const isRegistGroup = ref<boolean>();

const login = () => {
  const params = new URLSearchParams({
    email: registerParams.mail,
    password: registerParams.password,
  });
  axios.defaults.headers.common["Content-Type"] = "application/json";
  axios.post(config.APIURL + "/api/auth/sign_in", params).then((response) => {
    localStorage.setItem("access-token", response.headers["access-token"]);
    localStorage.setItem("client", response.headers["client"]);
    localStorage.setItem("uid", response.headers["uid"]);
    localStorage.setItem("token-type", response.headers["token-type"]);
  });
};

const registUser = async () => {

  isSubmitting.value = true;

  await $fetch<User>(config.APIURL + "/api/auth", {
    method: "POST",
    params: {
      name: registerParams.name,
      email: registerParams.mail,
      role_id: 7,
      password: registerParams.password,
      password_confirmation: registerParams.passwordConfirm,
    },
  }).then((res) => {
    registerParams.userId = res.data.id;
    localStorage.setItem("user_id", registerParams.userId.toString());
  });
  await $fetch(config.APIURL + "/user_details", {
    method: "POST",
    params: {
      student_id: registerParams.studentId,
      tel: registerParams.tel,
      department_id: registerParams.departmentId,
      grade_id: registerParams.gradeId,
      user_id: registerParams.userId,
    },
  });
  login();
  await new Promise((resolve) => setTimeout(resolve, 2000));
  router.push("/regist/group");
};

onMounted(async()=>{
  const setting = await $fetch<Setting>(config.APIURL+ "/user_page_settings") || null
    isRegistGroup.value = setting.data[0].is_regist_group
});

const currentDepartmentList = ref<{ id: number; name: string }[]>([]);
const createCurrentDepartmentList = (e: any) => {
  currentDepartmentList.value = GradeWithDepartmentList.filter((grade) => {
    return grade.id === Number(e.target.value);
  })[0].departmentList;
};
</script>

<template>
  <div>
    <div class="mx-[20%] my-[5%]">
      <Card v-if="isRegistGroup" border="none" padding="0px">
        <h1 class="text-3xl">{{ $t("User.registRepresentative") }}</h1>
        <Card border="none" align="end" class="!gap-1 md:!gap-2.5">
          <div class="flex flex-col md:flex-row">
            <p class="label">{{ $t("User.name") }}</p>
            <input
              class="form"
              v-model="registerParams.name"
              @change="handleName"
            />
          </div>
          <div>
            <p class="error">{{ nameError }}</p>
          </div>

          <div class="flex flex-col md:flex-row">
            <p class="label">{{ $t("User.studentId") }}</p>
            <input
              class="form"
              v-model="registerParams.studentId"
              maxlength="8"
              @change="handleStudentId"
            />
          </div>
          <div>
            <p class="error">{{ studentIdError }}</p>
          </div>

          <div class="flex flex-col md:flex-row">
            <p class="label">{{ $t("User.grade") }}</p>
            <select
              class="form w-72"
              v-model="registerParams.gradeId"
              @change="
                (e) => {
                  handleGrade(e);
                  createCurrentDepartmentList(e);
                }
              "
            >
              <option value="" selected disabled></option>
              <option v-for="grade in gradeList" :value="grade.id" key="grade">
                {{ grade.name }}
              </option>
            </select>
          </div>
          <div>
            <p class="error">{{ gradeError }}</p>
          </div>

          <div class="flex flex-col md:flex-row">
            <p class="label">{{ $t("User.department") }}</p>
            <select
              class="form w-72"
              v-model="registerParams.departmentId"
              @change="handleDepartment"
            >
              <option value="" selected disabled></option>
              <option
                v-for="department in currentDepartmentList"
                :value="department.id"
                key="department"
              >
                {{ department.name }}
              </option>
            </select>
          </div>
          <div>
            <p class="error">{{ departmentError }}</p>
          </div>

          <div class="flex flex-col md:flex-row">
            <p class="label">{{ $t("User.mail") }}</p>
            <input
              class="form w-72"
              v-model="registerParams.mail"
              placeholder="～@～.～"
              @change="handleEmail"
            />
          </div>
          <div>
            <p class="error">{{ emailError }}</p>
          </div>

          <div class="flex flex-col md:flex-row">
            <p class="label">{{ $t("User.tel") }}</p>
            <input
              class="form"
              :placeholder="$t('User.editTel')"
              maxlength="11"
              v-model="registerParams.tel"
              @change="handleTel"
            />
          </div>
          <div>
            <p class="error">{{ telError }}</p>
          </div>

          <div class="flex flex-col md:flex-row">
            <p class="label">{{ $t("User.password") }}</p>
            <input
              type="password"
              class="form"
              v-model="registerParams.password"
              @change="handlePassword"
            />
          </div>
          <div>
            <p class="error">{{ passwordError }}</p>
          </div>

          <div class="flex flex-col md:flex-row">
            <p class="label">{{ $t("User.passwordConfirm") }}</p>
            <input
              type="password"
              class="form"
              v-model="registerParams.passwordConfirm"
              @change="handlePasswordConfirm"
            />
          </div>
          <div>
            <p class="error">{{ passwordConfirmError }}</p>
          </div>
        </Card>
        <Row>
          <RegistPageButton
            :text="$t('Button.reset')"
            variant="danger"
            @click="reset"
          ></RegistPageButton>
          <RegistPageButton
            :disabled="!meta.valid || isSubmitting"
            :text="$t('Button.register')"
            @click="registUser"
          >
          </RegistPageButton>
        </Row>
      </Card>
      <div v-else class="text-3xl text-red-600 font-bold text-center">
        登録は締め切られました
      </div>
    </div>
  </div>
</template>

<style scoped>
.error {
  @apply text-red-500 ml-4;
}

.label {
  @apply flex-none text-xl pr-5;
}

.form {
  @apply flex-none border-solid border-2 w-72;
}
</style>
