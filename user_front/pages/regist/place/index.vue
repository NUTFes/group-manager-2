<script lang="ts" setup>
  import {Place} from '@/types'
  // baseURLの設定
  const config = useRuntimeConfig()
  // useStateで配列を定義
  const placeArray = useState("placeArray", () => [] as string[])
  const placeId = useState("placeId", () => [] as number[])
  const {data:places} = await useFetch<Place[]>(config.baseURL+"/places")
    !!places.value.data && places.value.data.forEach((place:Place)=>{
    placeArray.value.push(place['name'])
    placeId.value.push(place['id'])
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
              <option v-for = "place in placeArray" :key="place">{{place}}</option>
            </select>
          </div>
          <div class="flex">
            <p class="label">second preference</p>
            <select style="width:180px;">
              <option v-for = "place in placeArray" :key="place">{{place}}</option>
            </select>
          </div>
          <div class="flex">
            <p class="label">third preference</p>
            <select style="width:180px;">
              <option v-for = "place in placeArray" :key="place">{{place}}</option>
            </select>
          </div>
          <div class="flex">
            <p class="label">free description</p>
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
