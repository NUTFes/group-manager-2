<script lang="ts" setup>
import { User } from "@/types/regist/user"
import { useForm, useField } from "vee-validate";
import { userSchema } from "~~/utils/validate";

const { meta, isSubmitting } = useForm({
  validationSchema: userSchema,
});

const { handleChange: handleName, errorMessage: nameError } = useField('name')
const { handleChange: handleDepartment, errorMessage: departmentError } = useField('department')
const { handleChange: handleGrade, errorMessage: gradeError } = useField('grade')
const { handleChange: handleStudentId, errorMessage: studentIdError } = useField('studentId')
const { handleChange: handlePassword, errorMessage: passwordError } = useField('password')
const { handleChange: handlePasswordConfirm, errorMessage: passwordConfirmError } = useField('passwordConfirm')
const { handleChange: handleEmail, errorMessage: emailError } = useField('email')
const { handleChange: handleTel, errorMessage: telError } = useField('tel')

//v-modelで渡すparamsの定義
const registerParams = reactive({
  name: "",
  studentId: "",
  tel: "",
  mail: "",
  password: "",
  passwordConfirm: "",
  departmentId: "",
  gradeId: "",
  userId: 0
});

const departmentList: {id:number; name:string}[] = [
  { id: 1, name: "機械創造工学課程" },
  { id: 2, name: "電気電子情報工学課程" },
  { id: 3, name: "物質材料工学課程" },
  { id: 4, name: "環境社会基盤工学課程" },
  { id: 5, name: "生物機能工学課程" },
  { id: 6, name: "情報・経営システム工学課程" },
  { id: 7, name: "機械創造工学専攻" },
  { id: 8, name: "電気電子情報工学専攻" },
  { id: 9, name: "物質材料工学専攻" },
  { id: 10, name: "環境社会基盤工学専攻" },
  { id: 11, name: "生物機能工学専攻" },
  { id: 12, name: "情報・経営システム工学専攻" },
  { id: 13, name: "原子力システム安全工学専攻" },
  { id: 14, name: "システム安全専攻" },
  { id: 15, name: "技術科学イノベーション専攻" },
  { id: 16, name: "情報・制御工学専攻" },
  { id: 17, name: "材料工学専攻" },
  { id: 18, name: "エネルギー・環境工学専攻" },
  { id: 19, name: "生物統合工学専攻" },
  { id: 20, name: "その他" },
];
const gradeList:{id:number; name:string}[] = [
  { id: 1, name: "B1[学部1年]" },
  { id: 2, name: "B2[学部2年]" },
  { id: 3, name: "B3[学部3年]" },
  { id: 4, name: "B4[学部4年]" },
  { id: 5, name: "M1[修士1年]" },
  { id: 6, name: "M2[修士2年]" },
  { id: 7, name: "D1[博士1年]" },
  { id: 8, name: "D2[博士2年]" },
  { id: 9, name: "D3[博士3年]" },
  { id: 10, name: "GD1[イノベ1年]" },
  { id: 11, name: "GD2[イノベ2年]" },
  { id: 12, name: "GD3[イノベ3年]" },
  { id: 13, name: "GD4[イノベ4年]" },
  { id: 14, name: "GD4[イノベ5年]" },
  { id: 15, name: "その他" },
];
const config = useRuntimeConfig();
const router = useRouter();
const registUser = (async () => {
  await $fetch<User>(config.APIURL + "/api/auth",{
    method: "POST",
    params:{
      name: registerParams.name,
      email: registerParams.mail,
      role_id: 3,
      password: registerParams.password,
      password_confirmation: registerParams.passwordConfirm,
    }
  }).then((res) => {
    registerParams.userId = res.data.id;
    localStorage.setItem("user_id", registerParams.userId.toString());
  });
  await $fetch(config.APIURL + "/user_details",{
    method: "POST",
    params:{
      student_id: registerParams.studentId,
      tel: registerParams.tel,
      department_id: registerParams.departmentId,
      grade_id: registerParams.gradeId,
      user_id: registerParams.userId,
    }
  });
  router.push("/regist/group")
})
</script>

<template>
  <div>
    <div class="mx-[20%] my-[5%]">
      <Card>
        <h1 class="text-3xl">Registration of organization</h1>
        <Card border="none" align="end">
          <div class="flex">
            <p class="label">name</p>
            <input class="form" v-model="registerParams.name" @change="handleName">
          </div>
          <div>
            <p class="error">{{ nameError }}</p>
          </div>

          <div class="flex">
            <p class="label">student id</p>
            <input class="form" v-model="registerParams.studentId" maxlength="8" @change="handleStudentId">
          </div>
          <div>
            <p class="error">{{ studentIdError }}</p>
          </div>

          <div class="flex">
            <p class="label">department</p>
            <select class="form" style="width:180px;" v-model="registerParams.departmentId" @change="handleDepartment">
              <option value="" selected disabled></option>
              <option v-for="department in departmentList" :value=department.name key="department">{{department.name}}</option>
            </select>
          </div>
          <div>
            <p class="error">{{ departmentError }}</p>
          </div>

          <div class="flex">
            <p class="label">grade</p>
            <select class="form" style="width:180px;" v-model="registerParams.gradeId" @change="handleGrade">
              <option value="" selected disabled></option>
              <option v-for="grade in gradeList" :value=grade.name key="grade">{{grade.name}}</option>
            </select>
          </div>
          <div>
            <p class="error">{{ gradeError }}</p>
          </div>

          <div class="flex">
            <p class="label">mail adress</p>
            <input class="form" v-model="registerParams.mail" placeholder="～@～.～" @change="handleEmail">
          </div>
          <div>
            <p class="error">{{ emailError }}</p>
          </div>

          <div class="flex">
            <p class="label">tell number</p>
            <input class="form" placeholder="半角数字で10,11桁の番号" maxlength="11" v-model="registerParams.tel" @change="handleTel">
          </div>
          <div>
            <p class="error">{{ telError }}</p>
          </div>

          <div class="flex">
            <p class="label">password</p>
            <input type="password" class="form" v-model="registerParams.password" @change="handlePassword">
          </div>
          <div>
            <p class="error">{{ passwordError }}</p>
          </div>

          <div class="flex">
            <p class="label">password confirm</p>
            <input type="password" class="form" v-model="registerParams.passwordConfirm" @change="handlePasswordConfirm">
          </div>
          <div>
            <p class="error">{{ passwordConfirmError }}</p>
          </div>
        </Card>
        <Row>
          <RegistPageButton text="reset" @click="formReset"></RegistPageButton>
          <RegistPageButton :disabled='!meta.valid || isSubmitting' text="register" @click="registUser"></RegistPageButton>
        </Row>
      </Card>
    </div>
  </div>
</template>

<style scoped>
  .error {
    @apply
    text-red-500
      ml-4
  }
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
