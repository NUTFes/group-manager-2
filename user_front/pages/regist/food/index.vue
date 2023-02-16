<script lang="ts" setup>
  const stooltestList = [
    { id: 1, status: '検便準備中' },
    { id: 2, status: '検便無' },
    { id: 3, status: '検便有' },
  ]
</script>

<template>
  <div>
    <div class="mx-[20%] my-[5%]">
      <Card>
        <h1 class="text-3xl">Registration of foodstuffs</h1>
        <Card border="none" align="end" gap="20px">
          <div class="flex">
            <p class="label">name</p>
            <input class="form" />
          </div>
          <div class="flex">
            <p class="label">Do you cook?</p>
            <select style="width:180px;">
              <option value='true'>Yes</option>
              <option value='false'>No</option>
            </select>
          </div>
          <div class="flex">
            <p class="label">number of products on the first day</p>
            <input class="form" />
          </div>
          <div class="flex">
            <p class="label">number of products on the second day</p>
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
