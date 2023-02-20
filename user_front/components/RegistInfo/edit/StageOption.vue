<script lang="ts" setup>

</script>

<template>
  <Modal title="ステージオプションの編集">
    <template #form>
      <div class="text">所持機器の利用</div>
      <select class="entry"></select>
      <div class="text">音楽</div>
      <select class="entry"></select>
      <div class="text">撮影許可</div>
      <select class="entry"></select>
      <div class="text">騒音</div>
      <select class="entry"></select>
      <div class="text">ステージ内容</div>
      <textarea class="entry" />
    </template>
    <template #method>
      <div class="flex justify-between mt-8 mx-8">
        <ResetButton />
        <RegistButton />
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
