<script lang="ts" setup>
  import {Purchase} from '@/types'
  // baseURLの設定
  const config = useRuntimeConfig()
  // useStateで配列を定義
  const shopArray = useState("shopArray", () => [] as string[])
  const {data:shops} = await useFetch<Purchase[]>(config.baseURL+"/shops")
    !!shops.value.data && shops.value.data.forEach((shop:Purchase)=>{
    shopArray.value.push(shop['name'])
  })
</script>

<template>
  <div>
    <div class="mx-[20%] my-[5%]">
      <Card>
        <h1 class="text-3xl">Registration of places</h1>
        <Card border="none" align="end" gap="20px">
          <div class="flex">
            <p class="label">Place of purchase</p>
            <select style="width:180px;">
              <option v-for = "shop in shopArray" :key="shop">{{shop}}</option>
            </select>
          </div>
          <div class="flex">
            <p class="label">purchased item</p>
            <input class="form" />
          </div>
          <div class="flex">
            <p class="label">Is it row food?</p>
            <select style="width:180px;">
              <option value="" selected disabled></option>
              <option value='true'>Yes</option>
              <option value='false'>No</option>
            </select>
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
