<script lang="ts" setup>
const config = useRuntimeConfig();
const { data: currentUser } = await useFetch(config.baseURL + "/current_user");
console.log(currentUser.value);
</script>

<template>
  <div>regist Alarm</div>
</template>
