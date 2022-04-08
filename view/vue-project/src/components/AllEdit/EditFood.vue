<template>
  <div id="card">
    <h1 class="tytle">登録フォーム</h1>
    <div class="Blank">
    <div>食品名</div>
      <input type="text" v-model="food">
    </div>
    <div class="Blank">
      <div>調理の有無</div>
      <input type="text" v-model="is_cooking">
    </div>
    <div class="Blank">
      <div>１日目の販売個数</div>
      <input type="text" v-model="first_num">
    </div>
    <div class="Blank">
      <div>２日目の販売個数</div>
      <input type="text" v-model="second_num">
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