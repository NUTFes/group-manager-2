<script lang="ts" setup>

interface Emits {
  (e: 'update:editItem', isEditItem: boolean): void
}

const emits = defineEmits<Emits>()

const closeEditItem = () => {
  emits('update:editItem', false)
}

</script>

<template>
  <Modal title="貸出物品の編集">
    <template #close>
      <div class="flex justify-end">
        <button @click="closeEditItem()" class="hover:text-black hover:opacity-75"
        >✖</button>
      </div>
    </template>
    <template #form>
      <div class="text">貸出物品</div>
      <select class="entry" />
      <div class="text">個数</div>
      <input class="entry" />
      <div class="flex justify-between mt-8 mx-8">
        <RegistPageButton text="reset"></RegistPageButton>
        <RegistPageButton text="register" @click="closeEditItem()"></RegistPageButton>
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
