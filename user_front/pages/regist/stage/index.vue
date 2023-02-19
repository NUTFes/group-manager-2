<script lang="ts" setup>
  import {Stage} from '@/types'
  // baseURLの設定
  const config = useRuntimeConfig()
  // useStateで配列を定義
  const stageArray = useState("stageArray", () => [] as string[])
  const {data:stages} = await useFetch<Stage[]>(config.baseURL+"/stages")
    !!stages.value.data && stages.value.data.forEach((stage:Stage)=>{
    stageArray.value.push(stage['name'])
  })
</script>

<template>
  <div>
    <div class="mx-[20%] my-[5%]">
      <Card>
        <h1 class="text-3xl">Registration of stage on a sunny day</h1>
        <Card border="none" align="end" gap="10px">
          <div class="flex">
            <p class="label">first preference</p>
            <select style="width:180px;">
              <option v-for = "stage in stageArray" :key="stage">{{stage}}</option>
            </select>
          </div>
          <div class="flex">
            <p class="label">second preference</p>
            <select style="width:180px;">
              <option v-for = "stage in stageArray" :key="stage">{{stage}}</option>
            </select>
          </div>
          <h1 class="text-xl">if time is specified</h1>
          <div class="flex">
            <p class="label">preparation start time</p>
            <input class="form" />
          </div>
          <div class="flex">
            <p class="label">performance start time</p>
            <input class="form" />
          </div>
          <div class="flex">
            <p class="label">preparation end time</p>
            <input class="form" />
          </div>
          <div class="flex">
            <p class="label">clean-up end time</p>
            <input class="form" />
          </div>
          <h1 class="text-xl">if time is not specified</h1>
          <div class="flex">
            <p class="label">performance time</p>
            <input class="form" />
          </div>
          <div class="flex">
            <p class="label">preparation time</p>
            <input class="form" />
          </div>
          <div class="flex">
            <p class="label">clean-up time</p>
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
