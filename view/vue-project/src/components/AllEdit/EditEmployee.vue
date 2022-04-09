<template>
  <div id="card">
    <h1 class="tytle">登録フォーム</h1>
    <div class="Blank">
    <div>氏名</div>
      <input type="text" v-model="name">
    </div>
    <div class="Blank">
      <div>学籍番号</div>
      <input type="text" v-model="student_id">
    </div>
    <div>
      <button>←リセット</button>
      <button>登録する→</button>
    </div></div>
</template>

<style scoped>
#card{
  margin-right: 15%;
  margin-left: 15%;
}
input {
  border: 2px solid black;
}
</style>