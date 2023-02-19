<script lang="ts" setup>
  import {Category} from '@/types'
  // baseURLの設定
  const config = useRuntimeConfig()
  // useStateで配列を定義
  const categoryArray = useState("categoryArray", () => [] as string[])
  const {data:categories} = await useFetch<Category[]>(config.baseURL+"/group_categories")
    !!categories.value.data && categories.value.data.forEach((category:Category)=>{
      categoryArray.value.push(category['name'])
  })
</script>

<template>
  <div>
    <div class="mx-[20%] my-[5%]">
      <Card>
        <h1 class="text-3xl">Registration of organization</h1>
        <Card border="none" align="end" gap="20px">
          <div class="flex">
            <p class="label">group name</p>
            <input class="form" />
          </div>
          <div class="flex">
            <p class="label">shop name</p>
            <input class="form" />
          </div>
          <div class="flex">
            <p class="label">select categories</p>
            <select style="width:180px;">
              <option v-for = "category in categoryArray" :key="category">{{category}}</option>
            </select>
          </div>
          <div class="flex">
            <p class="label">Activity Details</p>
            <input class="form" />
          </div>
        </Card>
        <Button class="ml-[80%]" />
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
