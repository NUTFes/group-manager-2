<template>
  <div id="card">
    <h1 class="tytle">登録フォーム</h1>
    <div class="Blank">
    <div>貸出物品</div>
      <input type="text" v-model="item">
    </div>
    <div class="Blank">
      <div>個数</div>
      <input type="text" v-model="num">
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