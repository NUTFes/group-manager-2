<script lang="ts" setup>

</script>

<template>
  <Modal title="会場申請の編集">
    <template #form>
      <div class="text">第1希望</div>
      <select class="entry" />
      <div class="text">第2希望</div>
      <select class="entry" />
      <div class="text">第3希望</div>
      <select class="entry" />
      <div class="text">追記することがあればこちらにお書きください</div>
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
  border-top: solid 1px #717171;
  border-bottom: solid 1px #e0e0e0;
  border-radius: 5px;
  background-color: white;
}
</style>
