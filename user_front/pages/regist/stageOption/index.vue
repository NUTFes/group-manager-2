<script lang="ts" setup>
</script>

<template>
  <div>
    <div class="mx-[20%] my-[5%]">
      <Card>
        <h1 class="text-3xl">Registration of additional option</h1>
        <Card border="none" align="end" gap="20px">
          <div class="flex">
            <p class="label">Bringing in private property</p>
            <select style="width:180px;">
              <option value='true'>Yes</option>
              <option value='false'>No</option>
            </select>
          </div>
          <div class="flex">
            <p class="label">Whether speakers are used or not</p>
            <select style="width:180px;">
              <option value='true'>Yes</option>
              <option value='false'>No</option>
            </select>
          </div>
          <div class="flex">
            <p class="label">Whether loud-sound are used or not</p>
            <select style="width:180px;">
              <option value='true'>Yes</option>
              <option value='false'>No</option>
            </select>
          </div>
          <div class="flex">
            <p class="label">Whether camera are used or not</p>
            <select style="width:180px;">
              <option value='true'>Yes</option>
              <option value='false'>No</option>
            </select>
          </div>
          <div class="flex">
            <p class="label">Content Details</p>
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
