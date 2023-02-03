<script lang="ts" setup>
  import {Group} from '@/types'

  // baseURLの設定
  const config = useRuntimeConfig()

  // useStateで配列を定義
  const groupNameArray = useState("groupNameArray", () => [] as string[])

  const {data:groups} = await useFetch<Group[]>(config.baseURL+"/groups")
  !!groups.value && groups.value.forEach((group:Group)=>{
    groupNameArray.value.push(group['name'])
  })
  console.log(groupNameArray.value)
</script>

<template>
  <div>
    {{ groupNameArray }}
  </div>
</template>
