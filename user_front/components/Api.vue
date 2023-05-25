<script setup lang="ts">
const { data: posts } = await useFetch(
  process.env.VUE_APP_URL+'/users'
);

</script>

<template>
  <div>
    <h1>Posts一覧</h1>
    {{ posts.data[0].name }}
    <ul>
      <!-- <li v-for="post in posts" :key="post.id">{{ post.title }}</li> -->
    </ul>
  </div>
</template>
