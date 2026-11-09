<script lang="ts" setup>
import { Setting } from '@/types'
import { Group } from '@/types/regist/group';
import { GroupCategory } from '@/types/regist/groupCategory';
import { loginCheck } from '@/utils/methods'
import { useField, useForm } from 'vee-validate';
import { groupSchema } from '~~/utils/validate';

const { meta, isSubmitting } = useForm({
  validationSchema: groupSchema,
});

const { handleChange: handleChangeGroupName, errorMessage: groupNameError } = useField('groupName');
const { handleChange: handleChangeProjectName, errorMessage: projectNameError } = useField('projectName');
const { handleChange: handleChangeActivity, errorMessage: activityError } = useField('activity');
const { handleChange: handleChangeInternational, errorMessage: internationalError } = useField('international')
const { handleChange: handleChangeExternal, errorMessage: externalError } = useField('external')
const { handleChange: handleChangeCategory, errorMessage: categoryError } = useField('category');

const registerParams = reactive(
  {
    groupName: '',
    projectName: '',
    activity: '',
    categoryId: '',
    userId: '',
    fesYearId: 0,
    international: false,
    external: false
  }
)

const reset = () => {
  registerParams.groupName = "",
  registerParams.projectName = "",
  registerParams.activity = "",
  registerParams.categoryId = "",
  registerParams.userId = "",
  registerParams.fesYearId = 0,
  registerParams.international = false,
  registerParams.external = false
}

const config = useRuntimeConfig()
const router = useRouter()

const isRegistGroup = ref<boolean>();
const groupCategoryList = await $fetch<GroupCategory>(config.APIURL + "/group_categories")

onMounted(async () => {
  // ログインしていない場合は/welcomeに遷移させる
  console.log('ログインチェックを行います')
  loginCheck();
  registerParams.userId = localStorage.getItem("user_id") || ''
  const setting = await $fetch<Setting>(config.APIURL + "/user_page_settings")
  registerParams.fesYearId = setting.data[0].fes_year_id
  isRegistGroup.value = setting.data[0].is_regist_group

})

const registerCategory = async () => {

  isSubmitting.value = true;

  await $fetch<Group>(config.APIURL + "/groups", {
    method: "POST",
    params: {
      name: registerParams.groupName,
      project_name: registerParams.projectName,
      activity: registerParams.activity,
      user_id: registerParams.userId,
      group_category_id: registerParams.categoryId,
      fes_year_id: registerParams.fesYearId,
      committee: false,
      is_international: registerParams.international,
      is_external: registerParams.external
    },
    headers: {
      "Content-Type": "application/json",
    }
  }).then((res) => {
    localStorage.setItem("group_id", res.data.id.toString())
    localStorage.setItem("group_category_id", res.data.group_category_id.toString())
  })
  router.push("/mypage")
}
</script>

<template>
  <div>
    <div class="mx-[20%] my-[5%]">
      <Card v-if="isRegistGroup" border="none">
        <h1 class="text-3xl">{{ $t('Group.registGroup') }}</h1>
        <Card border="none" align="end" class="!gap-1 md:!gap-2.5">
          <div class="flex flex-col md:flex-row">
            <p class="label">{{ $t('Group.groupName') }}</p>
            <input class="form" v-model="registerParams.groupName" @change="handleChangeGroupName" :class="{ 'error-border': groupNameError}">
          </div>
          <div class="error-msg">{{ groupNameError }}</div>

          <div class="flex flex-col md:flex-row">
            <p class="label">{{ $t('Group.shopName') }}</p>
            <input class="form" v-model="registerParams.projectName" @change="handleChangeProjectName" :class="{ 'error-border': projectNameError }">
          </div>
          <div class="error-msg">{{ projectNameError }}</div>

          <div class="flex flex-col md:flex-row">
            <p class="label">{{ $t('Group.category') }}</p>
            <select class="form w-72" v-model="registerParams.categoryId" @change="handleChangeCategory" :class="{ 'error-border': categoryError }">
              <option selected disabled></option>
              <option v-for="category in groupCategoryList.data" :value="category.id" :key="category.id">{{ category.name }}
              </option>
            </select>
          </div>
          <div class="error-msg">{{ categoryError }}</div>

          <div class="flex flex-col md:flex-row">
            <p class="label">{{ $t('Group.international') }}</p>
            <input class="form" type="checkbox" v-model="registerParams.international" @change="handleChangeInternational">
            <span class="slider round"></span>
          </div>
          <div class="error-msg">{{ internationalError }}</div>

          <div class="flex flex-col md:flex-row">
            <p class="label">{{ $t('Group.external') }}</p>
            <input class="form" type="checkbox" v-model="registerParams.external" @change="handleChangeExternal">
            <span class="slider round"></span>
          </div>
          <div class="error-msg">{{ externalError }}</div>

          <div class="flex flex-col md:flex-row">
            <p class="label">{{ $t('Group.activityDetails') }}</p>
            <input class="form" v-model="registerParams.activity" @change="handleChangeActivity" :class="{ 'error-border': activityError }">
          </div>
          <div class="error-msg">{{ activityError }}</div>
        </Card>
        <Row>
          <RegistPageButton :text="$t('Button.reset')" @click="reset" variant="danger"></RegistPageButton>
          <RegistPageButton :disabled='!meta.valid || isSubmitting' :text="$t('Button.register')" @click="registerCategory"></RegistPageButton>
        </Row>
      </Card>
      <div v-else class="text-3xl text-red-600 font-bold text-center">
        登録は締め切られました
      </div>
    </div>
  </div>
</template>

<style scoped>
.error-msg {
  @apply
    text-rose-600
}
.error-border {
  @apply
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
    w-72
}
</style>
