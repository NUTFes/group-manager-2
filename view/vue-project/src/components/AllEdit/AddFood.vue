<template>
  <div id="card">
    <h1 class="tytle">販売食品追加</h1>
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
    <div style="display:flex;">
      <button id="btn" type="button" onclick="document.getElementById('addFood').close()">閉じる</button>
      <button id="btn" type="button" onclick="document.getElementById('addFood').close()">登録する</button>
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
  #btn{
    background: #032030;
    color: white;
    font-size: 15px;
    font-weight: bold;
    cursor: pointer;
    width: 80px;
    height: 30px;
    display: block;
    margin: 3% auto 3% auto;
  }
  #btn:hover {
    box-shadow: -2px -2px 5px #FFF, 2px 2px 5px #BABECC;
    background-image: linear-gradient(90deg, rgba(247, 93, 139, 1), rgba(254, 220, 64, 1));
    border: white;
  }
  #btn:active{
    box-shadow: inset 1px 1px 2px #BABECC, inset -1px -1px 2px #FFF;
  }
</style>