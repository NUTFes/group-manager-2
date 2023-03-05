<script lang="ts" setup>
import {Setting} from '@/types'
import { Group } from '@/types/regist/group';
const categoryArray = [
  {id: 1, name: "模擬店(食品販売)"},
  {id: 2, name: "模擬店(物品販売)"},
  {id: 3, name: "ステージ企画"},
  {id: 4, name: "展示・体験"},
  {id: 5, name: "研究室公開"},
  {id: 6, name: "その他"},
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
        <Card border="none" align="end" gap="20px">

          <div class="flex">
            <p class="label">group name</p>
            <input class="form" v-model="registerParams.groupName">
          </div>

          <div class="flex">
            <p class="label">shop name</p>
            <input class="form" v-model="registerParams.projectName">
          </div>

          <div class="flex">
            <p class="label">select categories</p>
            <select style="width:180px;" v-model="registerParams.categoryId">
              <option selected disabled></option>
              <option v-for = "category in categoryArray" :value="category.id" :key="category.id">{{category.name}}</option>
            </select>
          </div>

          <div class="flex">
            <p class="label">Activity Details</p>
            <input class="form" v-model="registerParams.activity">
          </div>

        </Card>
        <Row>
          <RegistPageButton text="reset"></RegistPageButton>
          <RegistPageButton text="register" @click="registerCategory"></RegistPageButton>
        </Row>
      </Card>
    </div>
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
</style>>
