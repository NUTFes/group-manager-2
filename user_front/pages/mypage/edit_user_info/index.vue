<script lang="ts" setup>
import { loginCheck } from "@/utils/methods";
import { useForm, useField } from "vee-validate";
import { userDetailSchema } from "~~/utils/validate";
import { User, UserDetail, EditUser, CurrentUser } from "~~/types/currentUser";
import { gradeList, GradeWithDepartmentList } from "~/utils/list";

const config = useRuntimeConfig();
const router = useRouter();

const user = ref<User>();
const userDetail = ref<UserDetail>();

const { meta, isSubmitting } = useForm({
  validationSchema: userDetailSchema,
});
const { handleChange: handleName, errorMessage: nameError } = useField("name");
const { handleChange: handleDepartment, errorMessage: departmentError } =
  useField("department");
const { handleChange: handleGrade, errorMessage: gradeError } =
  useField("grade");
const { handleChange: handleStudentId, errorMessage: studentIdError } =
  useField("studentId");
const { handleChange: handleEmail, errorMessage: emailError } =
  useField("email");
const { handleChange: handleTel, errorMessage: telError } = useField("tel");

onMounted(async () => {
  await $fetch<CurrentUser>(config.APIURL + "/api/v1/current_user", {
    headers: {
      "Content-Type": "application/json",
      "access-token": localStorage.getItem("access-token") || "",
      client: localStorage.getItem("client") || "",
      uid: localStorage.getItem("uid") || "",
    },
  }).then((response) => {
    user.value = response.data.user;
    userDetail.value = response.data.user_detail;
  });
});

const editParams = ref({
  name: user.value?.name,
  mail: user.value?.email,
  studentId: userDetail.value?.student_id,
  tel: userDetail.value?.tel,
  departmentId: userDetail.value?.department_id,
  gradeId: userDetail.value?.grade_id,
});

const editUser = async () => {
  await $fetch<CurrentUser>(
    config.APIURL + "/api/v1/current_user/edit_user_info",
    {
      method: "POST",
      params: {
        name: editParams.value.name,
        email: editParams.value.mail,
        student_id: editParams.value.studentId,
        tel: editParams.value.tel,
        department_id: editParams.value.departmentId,
        grade_id: editParams.value.gradeId,
      },
      headers: {
        "Content-Type": "application/json",
        "access-token": localStorage.getItem("access-token") || "",
        client: localStorage.getItem("client") || "",
        uid: localStorage.getItem("uid") || "",
      },
    }
  ).then(() => {
    localStorage.setItem("uid", editParams.value.mail || "");
    alert('登録できました')
    router.push("/mypage");
  });
};

// ログインしていない場合は/welcomeに遷移させる
loginCheck();

const currentDepartmentList = ref<{ id: number; name: string }[]>([]);
const createCurrentDepartmentList = (e: any) => {
  currentDepartmentList.value = GradeWithDepartmentList.filter((grade) => {
    return grade.id === Number(e.target.value);
  })[0].departmentList;
};
</script>

<template>
  <div class="regist-card">
    <NuxtLink to="/mypage" class="regist-back-link">{{
      $t("Mypage.goToMypage")
    }}</NuxtLink>
    <div class="reist-title-content">
      <div class="user-info">{{ $t("User.userInfo") }}</div>
    </div>
    <div class="flex row justify-center gap-3 pb-11">
      <div class="text-xl">
        <p>{{ $t("User.name") }}：</p>
        <p>{{ $t("User.mail") }}：</p>
        <p>{{ $t("User.studentId") }}：</p>
        <p>{{ $t("User.tel") }}：</p>
        <p>{{ $t("User.department") }}：</p>
        <p>{{ $t("User.grade") }}：</p>
      </div>
      <div class="text-lg">
        <p>{{ user?.name }}</p>
        <p>{{ user?.email }}</p>
        <p>{{ userDetail?.student_id }}</p>
        <p>{{ userDetail?.tel }}</p>
        <p>{{ userDetail?.department }}</p>
        <p>{{ userDetail?.grade }}</p>
      </div>
    </div>
    <div class="reist-title-content">
      <div class="user-info">{{ $t("User.editUser") }}</div>
    </div>
    <div>
      <input
        :placeholder="$t('User.editName')"
        v-model="editParams.name"
        @change="handleName"
      />
      <p class="error">{{ nameError }}</p>
      <input
        placeholder="～@～.～"
        v-model="editParams.mail"
        @change="handleEmail"
      />
      <p class="error">{{ emailError }}</p>
      <input
        :placeholder="$t('User.editStudentId')"
        maxlength="8"
        v-model="editParams.studentId"
        @change="handleStudentId"
      />
      <p class="error">{{ studentIdError }}</p>
      <input
        :placeholder="$t('User.editTel')"
        maxlength="11"
        v-model="editParams.tel"
        @change="handleTel"
      />
      <p class="error">{{ telError }}</p>
      <select
        :placeholder="$t('User.grade')"
        v-model="editParams.gradeId"
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
      <p class="error">{{ gradeError }}</p>
      <select
        :placeholder="$t('User.department')"
        v-model="editParams.departmentId"
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
      <p class="error">{{ departmentError }}</p>
    </div>
    <div class="regist-button">
      <RegistPageButton
        :text="$t('Button.edit')"
        :disabled="!meta.valid || isSubmitting"
        @click="editUser"
        >{{ $t("Button.edit") }}</RegistPageButton
      >
    </div>
  </div>
</template>

<style>
.error {
  @apply text-red-500 ml-4;
}
.regist-card {
  @apply w-[1000px]
    mx-auto;
}

.reist-title-content {
  @apply flex
    flex-col
    justify-center
    items-center;
}

.regist-back-link {
  @apply block
    text-lg
    text-[#e040fb]
    cursor-pointer
    w-fit
    mt-5;
}

.regist-back-link:hover {
  @apply font-bold
    text-[#e040fb];
}

.user-info {
  @apply text-3xl
    font-bold
    mb-1;
  padding: 1% 1% 1% 2%;
}

select,
input {
  @apply text-left
    p-[1%]
    h-[50px]
    w-[1000px]
    mt-5
    rounded-[7px]
    text-lg
    align-top;
}
select,
input:required {
  border: 1px solid red;
}
select,
input:invalid {
  border: 1px solid red;
}
select,
input:valid {
  border: 1px solid #333333;
}

.regist-button {
  @apply text-right
    mb-8;
}

.regist-submit-button {
  @apply text-xl
    text-[#333333]
    bg-[#eceff1]
    font-bold
    rounded-[5px]
    mt-[2%]
    py-[1%]
    px-[5%]
    cursor-pointer;
}
.regist-submit-button:hover {
  @apply text-[#333333];
  background-image: linear-gradient(
    90deg,
    rgba(247, 93, 139, 1),
    rgba(254, 220, 64, 1)
  );
}
.regist-submit-button:active {
  @apply text-[#333333];
  box-shadow: inset 1px 1px 2px #babecc, inset -1px -1px 2px #fff;
}
</style>
