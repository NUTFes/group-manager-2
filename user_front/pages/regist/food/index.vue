<script lang="ts" setup>
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
              <option value="" selected disabled></option>
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
        <Row>
          <RegistButton />
          <ResetButton />
          <AddButton />
        </Row>
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
