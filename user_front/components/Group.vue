<script lang="ts" setup>
  import axios, { AxiosInstance } from 'axios'
  import {Group} from '@/types'

  const client: AxiosInstance = axios.create({
    baseURL: 'http://localhost:3000',
    headers: {
      'Content-Type': 'application/json',
    },
  })
  const groupNameArray = ref<string[]>([])

  client.get('/groups').then((res) => {
    const groups:Group[] = res.data.data
    groups.forEach((group:Group)=>{
      groupNameArray.value.push(group['name'])
    })
    console.log(groupNameArray)
  })
</script>

<template>
  <div></div>
</template>
