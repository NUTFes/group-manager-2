<script lang="ts" setup>
  import {Item} from '@/types'
  // baseURLの設定
  const config = useRuntimeConfig()
  // useStateで配列を定義
  const itemArray = useState("itemArray", () => [] as string[])
  const {data:items} = await useFetch<Item[]>(config.baseURL+"/rental_items")
    !!items.value.data && items.value.data.forEach((item:Item)=>{
    itemArray.value.push(item['name'])
  })
</script>

<template>
  <div>
    <div class="mx-[20%] my-[5%]">
      <Card>
        <h1 class="text-3xl">Registration of places</h1>
        <Card border="none" align="end" gap="20px">
          <div class="flex">
            <p class="label">first preference</p>
            <select style="width:180px;">
              <option value="" selected disabled></option>
              <option v-for = "item in itemArray" :key="item">{{item}}</option>
            </select>
          </div>
          <div class="flex">
            <p class="label">number of pieces required</p>
            <input class="form" />
          </div>
        </Card>
        <Row>
          <RegistButton />
          <ResetButton />
          <AddButton />
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
