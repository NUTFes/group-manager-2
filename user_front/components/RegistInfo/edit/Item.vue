<script lang="ts" setup>

</script>

<template>
<Modal title="貸出物品の編集">
  <template #form>
    <div class="my-1">貸出物品</div>
    <select class="entry" />
    <div class="my-1">個数</div>
    <input class="entry" />
  </template>
  <template #method>
    <div class="flex m-4 justify-between">
      <ResetButton />
      <RegistButton />
    </div>
  </template>
</Modal>

</template>

<style scoped>
.entry {
  border: 1px solid silver;
  border-top : solid 1px #717171;
  border-bottom : solid 1px #e0e0e0;
  border-radius: 5px;
  background-color: white;
}
</style>
