<script lang="ts" setup>
import axios from "axios";
import { useForm, useField } from "vee-validate";
import { PasswordResetParams } from "~~/types/mypage/passwordReset";

definePageMeta({
  layout: false,
});

const { meta, isSubmitting } = useForm({
  validationSchema: passwordResetSchema,
});

const { handleChange: handlePassword, errorMessage: passwordError } =
  useField("password");
const {
  handleChange: handlePasswordConfirm,
  errorMessage: passwordConfirmError,
} = useField("passwordConfirm");

const router = useRouter();
const config = useRuntimeConfig();

const PasswordResetParams = reactive<PasswordResetParams>({
  password: "",
  passwordConfirm: "",
});

const submit = () => {
  const url = config.APIURL + "/api/v1/current_user/password_reset";
  axios
    .post(
      url,
      {
        password: PasswordResetParams.password,
        password_confirmation: PasswordResetParams.passwordConfirm,
      },
      {
        headers: {
          "Content-Type": "application/json",
          "access-token": localStorage.getItem("access-token"),
          client: localStorage.getItem("client"),
          uid: localStorage.getItem("uid"),
        },
      }
    )
    .then(
      (response) =>{
        alert('登録できました\nRegistration Success')
        router.push("/mypage");
      },
      (error) => {
        alert('登録できませんでした\nRegistration Failure')
      }
    )
}

onMounted(async () => {
  loginCheck();
});
</script>

<template>
  <Header />
  <div class="regist-card">
    <div class="reist-title-content">
      <div class="user-info">{{ $t("User.resetPassword") }}</div>
    </div>
    <div>
      <div class="flex">
        <input
          type="password"
          class="form"
          v-model="PasswordResetParams.password"
          @change="handlePassword"
          :placeholder="$t('User.newPassword')"
        />
      </div>
      <div>
        <p class="error">{{ passwordError }}</p>
      </div>
      <input
        type="password"
        class="form"
        v-model="PasswordResetParams.passwordConfirm"
        @change="handlePasswordConfirm"
        :placeholder="$t('User.newPasswordConfirm')"
      />
      <div>
        <p class="error">{{ passwordConfirmError }}</p>
      </div>
    </div>
    <div class="regist-button">
      <RegistPageButton  @click="submit" :disabled="!meta.valid || isSubmitting" :text="$t('Button.register')"/>
    </div>
  </div>
</template>

<style scoped>
.regist-card {
  @apply w-[1000px]
    mx-auto;
}

.error {
  @apply text-red-500 ml-4 mb-5;
}

.reist-title-content {
  @apply flex
    flex-col
    justify-center
    items-center
    my-8;
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
    mb-6;
  padding: 1% 1% 1% 2%;
}

.regist-card input, .regist-card select {
  @apply text-left
    p-[1%]
    h-[50px]
    w-[1000px]
    mb-5
    rounded-[7px]
    text-lg
    align-top;
}

.regist-card input:required, .regist-card select {
  border: 1px solid red;
}

.regist-card input:invalid, .regist-card select {
  border: 1px solid red;
}

.regist-card input:valid, .regist-card select {
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
