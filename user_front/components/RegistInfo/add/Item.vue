<script lang="ts" setup>
const isShow = ref<boolean>()


interface Emits {
  (e: 'update:visible', visible: boolean): void
}

const emits = defineEmits<Emits>()

const modalClose = () => {
  emits('update:visible', false)
}

</script>

<template>
  <Modal v-model:visible="isShow" title="貸出物品の追加">
    <template #form>
      <div class="text">貸出物品</div>
      <select class="entry"></select>
      <div class="text">個数</div>
      <input class="entry">
    </template>
    <template #method>
      <div class="flex justify-between mt-8 mx-8">
        <RegistButton />
        <ResetButton @click="modalClose()" />
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
