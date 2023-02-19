<script lang="ts" setup>

onMounted(() => {
const config = useRuntimeConfig();
const { data: currentUser } = useFetch(config.baseURL + "/api/v1/current_user",
{
  headers:{
    "Content-Type": "application/json",
    "access-token": localStorage.getItem("access-token") || "",
    "client": localStorage.getItem("client") || "",
    "uid": localStorage.getItem("uid") || ""
  }
})
console.log(currentUser);
});

// console.log(currentUser);
// console.log(currentUser);
</script>

<template>
  <div>regist Alarm</div>
</template>
