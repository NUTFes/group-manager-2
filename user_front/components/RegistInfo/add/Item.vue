<script lang="ts" setup>

</script>

<template>
  <Modal title="貸出物品の追加">
    <template #form>
      <div class="mx-8 mt-4">
        <div class="my-1">貸出物品</div>
        <select class="entry"></select>
        <div class="my-1">個数</div>
        <input class="entry">
      </div>
    </template>
    <template #method>
      <div class="flex justify-between mt-8 mx-8">
        <RegistButton />
        <ResetButton />
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
