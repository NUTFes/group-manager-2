<script lang="ts" setup>
  const formTitle = [
    "name",
    "student id",
    "department",
    "grade",
    "mail adress",
    "phone number",
  ];
</script>

<template>
  <div>
    <div class="mx-[20%] my-[5%]">
      <Card>
        <h1 class="text-3xl">Registration of organization</h1>
        <Card border="none" align="end" gap="20px">
          <div v-for="title in formTitle" :key="title" class="flex">
            <p class="label">{{ title }}</p>
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
