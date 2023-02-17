<script lang="ts" setup>

</script>

<template>
  <div>
    <div class="mx-[20%] my-[5%]">
      <Card>
        <h1 class="text-3xl">Registration of organization</h1>
        <Card border="none" align="end" gap="20px">
          <div class="flex">
            <p class="label">product name</p>
            <input class="form" />
          </div>
          <div class="flex">
            <p class="label">maximum rated power</p>
            <input class="form" />
          </div>
          <div class="flex">
            <p class="label">maker</p>
            <input class="form" />
          </div>
          <div class="flex">
            <p class="label">model</p>
            <input class="form" />
          </div>
          <div class="flex">
            <p class="label">product URL</p>
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
