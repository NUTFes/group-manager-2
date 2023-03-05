<script lang="ts" setup>

interface Emits {
  (e: 'update:editSubRep', isEditSubRep: boolean): void
}

const emits = defineEmits<Emits>()

const closeEditSubRep = () => {
  emits('update:editSubRep', false)
}
</script>

<template>
  <Modal title="副代表の編集">
    <template #close>
      <div class="flex justify-end">
        <button @click="closeEditSubRep()" class="hover:text-black hover:opacity-75"
        >✖</button>
      </div>
    </template>
    <template #form>
      <div class="text">名前</div>
      <input class="entry">
      <div class="text">学科</div>
      <select class="entry" />
      <div class="text">学年</div>
      <select class="entry" />
      <div class="text">電話番号</div>
      <input class="entry">
      <div class="text">メールアドレス</div>
      <input class="entry">
      <div class="text">学籍番号</div>
      <input class="entry">
      <div class="flex justify-between mt-8 mx-8">
          <RegistPageButton text="reset"></RegistPageButton>
          <RegistPageButton text="register" @click="closeEditSubRep()"></RegistPageButton>
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
