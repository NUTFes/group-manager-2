<script lang="ts" setup>
  import {Group} from '@/types'

  // baseURLの設定
  const config = useRuntimeConfig()
  console.log(config)

  // useStateで配列を定義
  const groupNameArray = useState("groupNameArray", () => [] as string[])

  const {data:groups} = await useFetch<Group[]>(config.baseURL+"/groups")
  console.log(groups.value?.data)
  !!groups.value.data && groups.value.data.forEach((group:Group)=>{
    groupNameArray.value.push(group['name'])
  })
</script>

<template>
  <div>
    {{ groupNameArray }}
  </div>
</template>
