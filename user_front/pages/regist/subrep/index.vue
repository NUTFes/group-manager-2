<script lang="ts" setup>
import { loginCheck } from "@/utils/methods";
import { useField, useForm } from "vee-validate";
import { subRepSchema } from "~~/utils/validate";

const { meta, isSubmitting } = useForm({
  validationSchema: subRepSchema,
});

const {handleChange: handleName, errorMessage: nameError} = useField("name");
const {handleChange: handleStudentId, errorMessage: studentIdError} = useField("studentId");
const {handleChange: handleTel, errorMessage: telError} = useField("tel");
const {handleChange: handleMail, errorMessage: mailError} = useField("email");
const {handleChange: handleDepartmentId, errorMessage: departmentIdError} = useField("department");
const {handleChange: handleGradeId, errorMessage: gradeIdError} = useField("grade");

// ログインしていない場合は/welcomeに遷移させる
loginCheck();

  const registerParams = reactive(
    {
      name: "",
      studentId: "",
      tel: "",
      mail: "",
      departmentId: "",
      gradeId: "",
      groupId: "",
      groupCategoryId: "",
    }
  )
  const departmentList = [
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
  const gradeList = [
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

  onMounted(async()=>{

    registerParams.groupId = localStorage.getItem("group_id") || "";
    registerParams.groupCategoryId = localStorage.getItem("group_category_id") || "";
  })
  const config = useRuntimeConfig();
  const router = useRouter();
  const registerSubRep = async () => {
    await $fetch(config.APIURL + "/sub_reps", {
      method: "POST",
      params:{
        name: registerParams.name,
        student_id: registerParams.studentId,
        tel: registerParams.tel,
        email: registerParams.mail,
        department_id: registerParams.departmentId,
        grade_id: registerParams.gradeId,
        group_id: registerParams.groupId,
      }
    })
    if (registerParams.groupCategoryId === "3"){
      router.push("/regist/stage/sunny");
    } else {
      router.push("/regist/place");
    }
  }
  const skip = () =>{
    if (registerParams.groupCategoryId === "3"){
      router.push("/regist/stage/sunny");
    } else {
      router.push("/regist/place");
    }
  }
</script>

<template>
  <div>
    <div class="mx-[20%] my-[5%]">
      <Card>
        <h1 class="text-3xl">Registration of subrepresentative</h1>
        <Card border="none" align="end">
          <div class="flex">
            <p class="label">name</p>
            <input class="form" v-model = "registerParams.name" @change="handleName" :class="{'error_border': nameError}">
          </div>
          <div class="error_msg">{{ nameError }}</div>

          <div class="flex">
            <p class="label">student id</p>
            <input class="form" v-model = "registerParams.studentId" maxlength="8" @change="handleStudentId" :class="{ 'error_border': studentIdError }">
          </div>
          <div class="error_msg">{{ studentIdError }}</div>

          <div class="flex">
            <p class="label">department</p>
            <select style="width:180px;" v-model = "registerParams.departmentId" @change="handleDepartmentId" :class="{ 'error_border': departmentIdError }">
              <option value="" selected disabled></option>
              <option v-for = "department in departmentList" :key="department.id" :value="department.id">{{department.name}}</option>
            </select>
          </div>
          <div class="error_msg">{{ departmentIdError }}</div>

          <div class="flex">
            <p class="label">grade</p>
            <select style="width:180px;" v-model = "registerParams.gradeId" @change="handleGradeId" :class="{ 'border-rose-600': gradeIdError }">
              <option value="" selected disabled></option>
              <option v-for = "grade in gradeList" :key="grade.id" :value="grade.id">{{grade.name}}</option>
            </select>
          </div>
          <div class="error_msg">{{ gradeIdError }}</div>

          <div class="flex">
            <p class="label">mail adress</p>
            <input class="form" v-model="registerParams.mail" @change="handleMail" :class="{ 'error_border': mailError }">
          </div>
          <div class="error_msg">{{ mailError }}</div>

          <div class="flex">
            <p class="label">tell number</p>
            <input class="form" v-model="registerParams.tel" maxlength="11" @change="handleTel" :class="{ 'error_border': telError }">
          </div>
          <div class="error_msg">{{ telError }}</div>
        </Card>
        <Row>
          <RegistPageButton text="reset"></RegistPageButton>
          <RegistPageButton text="register" :disabled='!meta.valid || isSubmitting' @click="registerSubRep"></RegistPageButton>
          <RegistPageButton text="skip" @click="skip"></RegistPageButton>
        </Row>
      </Card>
    </div>
  </div>
</template>

<style scoped>
  .error_msg {
    @apply
      text-rose-600
  }
  .error_border {
    @apply
      border-2
      border-rose-600
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
</style>>
