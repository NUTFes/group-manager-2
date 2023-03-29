<script lang="ts" setup>
import {Setting} from '@/types'
import { Group } from '@/types/regist/group';
import { useField, useForm } from 'vee-validate';
import { groupSchema } from '~~/utils/validate';

const { meta, isSubmitting } = useForm({
  validationSchema: groupSchema,
});

const { handleChange: handleChangeGroupName, errorMessage: groupNameError } = useField('groupName');
const { handleChange: handleChangeProjectName, errorMessage: projectNameError } = useField('projectName');
const { handleChange: handleChangeActivity, errorMessage: activityError } = useField('activity');
const { handleChange: handleChangeCategory, errorMessage: categoryError } = useField('category');

const categoryArray = [
  {id: 1, name: "模擬店(食品販売)"},
  {id: 2, name: "模擬店(物品販売)"},
  {id: 3, name: "ステージ企画"},
  {id: 4, name: "展示・体験"},
  {id: 5, name: "研究室公開"},
]

const registerParams = reactive(
  {
    groupName: '',
    projectName: '',
    activity: '',
    categoryId: '',
    userId: '',
    fesYearId: 0,
  }
)

const config = useRuntimeConfig()
const router = useRouter()

onMounted(async () => {
  registerParams.userId = localStorage.getItem("user_id") || ''
  const setting = await $fetch<Setting>(config.APIURL + "/user_page_settings")
  registerParams.fesYearId = setting.data[0].fes_year_id
})

const registerCategory = async () => {
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
    },
    headers: {
      "Content-Type": "application/json",
    }
  }).then((res) => {
    localStorage.setItem("group_id", res.data.id.toString())
    localStorage.setItem("group_category_id", res.data.group_category_id.toString())
  })
  router.push("/regist/subrep")
}
</script>

<template>
  <div>
    <div class="mx-[20%] my-[5%]">
      <Card>
        <h1 class="text-3xl">Registration of organization</h1>
        <Card border="none" align="end">
          <div class="flex">
            <p class="label">group name</p>
            <input class="form" v-model="registerParams.groupName" @change="handleChangeGroupName" :class="{ 'error-border': groupNameError}">
          </div>
          <div class="error-msg">{{ groupNameError }}</div>

          <div class="flex">
            <p class="label">shop name</p>
            <input class="form" v-model="registerParams.projectName" @change="handleChangeProjectName" :class="{ 'error-border': projectNameError }">
          </div>
          <div class="error-msg">{{ projectNameError }}</div>

          <div class="flex">
            <p class="label">select categories</p>
            <select style="width:180px;" v-model="registerParams.categoryId" @change="handleChangeCategory" :class="{ 'error-border': categoryError }">
              <option selected disabled></option>
              <option v-for="category in categoryArray" :value="category.id" :key="category.id">{{category.name}}</option>
            </select>
          </div>
          <div class="error-msg">{{ categoryError }}</div>

          <div class="flex">
            <p class="label">Activity Details</p>
            <input class="form" v-model="registerParams.activity" @change="handleChangeActivity" :class="{ 'error-border': activityError }">
          </div>
          <div class="error-msg">{{ activityError }}</div>
        </Card>
        <Row>
          <RegistPageButton text="reset"></RegistPageButton>
          <RegistPageButton :disabled='!meta.valid || isSubmitting' text="register" @click="registerCategory"></RegistPageButton>
        </Row>
      </Card>
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
  }
</style>>
