<script lang="ts" setup>

interface Emits {
  (e: 'update:editStage', isEditStage: boolean): void
}

const emits = defineEmits<Emits>()

const closeEditStage = () => {
  emits('update:editStage', false)
}

</script>

<template>
  <Modal title="ステージの編集">
    <template #close>
      <div class="flex justify-end">
        <button @click="closeEditStage()" class="hover:text-black hover:opacity-75"
        >✖</button>
      </div>
    </template>
    <template #form>
      <div class="text">日程</div>
      <select class="entry" />
      <div class="text">第一希望場所</div>
      <select class="entry" />
      <div class="text">第二希望場所</div>
      <select class="entry" />
      <div>
        <div class="text">準備時間幅</div>
        <input class="entry" />
        <div class="text">使用時間幅</div>
        <input class="entry" />
        <div class="text">片付け時間幅</div>
        <input class="entry" />
        <div class="text">準備開始時間</div>
        <input class="entry" />
      </div>
      <!-- TODO: タブ切り替え -->
      <!-- <div v-if="showTab">
        <div class="my-1">パフォーマンス開始時間</div>
        <input class="entry" />
        <div class="my-1">パフォーマンス終了時間</div>
        <input class="entry" />
        <div class="my-1">片付け終了時間</div>
        <input class="entry" />
      </div> -->
      <div class="flex justify-between mt-8 mx-8">
        <ResetButton />
        <RegistButton @click="closeEditStage()" />
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
