<script lang="ts" setup>

const isShow = ref<boolean>()

</script>

<template>
  <Modal v-model:visible="isShow" title="電力申請の追加">
    <template #form>
      <div class="text">使用物品名</div>
      <input class="entry">
      <div class="text">最大定格電力[W]</div>
      <input class="entry">
      <div class="text">メーカー</div>
      <input class="entry">
      <div class="text">型番</div>
      <input class="entry">
      <div class="text">URL</div>
      <input class="entry">
    </template>
    <template #method>
      <div class="flex justify-between mt-8 mx-8">
        <RegistButton @close="isShow = false"/>
        <ResetButton />
      </div>
    </template>
  </Modal>
</template>

<style scoped>

.text {
  margin: 3% 10% 0%;
}
.entry {
  margin: 0% 10%;
  border: 1px solid silver;
  border-top : solid 1px #717171;
  border-bottom : solid 1px #e0e0e0;
  border-radius: 5px;
  background-color: white;
}
</style>
