<template>
  <div id="card">
    <h1 class="tytle">登録フォーム</h1>
    <div class="Blank">
    <div>使用物品名</div>
      <input type="text" v-model="item">
    </div>
    <div class="Blank">
      <div>最大定格電力</div>
      <input type="text" v-model="power">
    </div>
    <div class="Blank">
      <div>メーカー</div>
      <input type="text" v-model="model">
    </div>
    <div class="Blank">
      <div>型番</div>
      <input type="text" v-model="manufacturer">
    </div>
    <div class="Blank">
      <div>URL</div>
      <input type="text" v-model="url">
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