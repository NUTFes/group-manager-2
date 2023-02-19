<script lang="ts" setup>

</script>

<template>
  <Modal title="電力申請の追加">
    <template #form>
      <div class="mt-4 w-[80%]">
        <div>使用物品名</div>
        <input class="entry">
        <div>最大定格電力[W]</div>
        <input class="entry">
        <div>メーカー</div>
        <input class="entry">
        <div>型番</div>
        <input class="entry">
        <div>URL</div>
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
  border-top: solid 1px #717171;
  border-bottom: solid 1px #e0e0e0;
  border-radius: 5px;
  background-color: white;
}
</style>
