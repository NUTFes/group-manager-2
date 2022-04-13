<template>
  <div id="card">
    <h1 class="tytle">従業員追加申請</h1>
    <div class="Blank">
    <div>氏名</div>
      <input type="text" v-model="name">
    </div>
    <div class="Blank">
      <div>学籍番号</div>
      <input type="text" v-model="student_id">
    </div>
    <div style="display:flex;">
      <button id="btn" type="button" onclick="document.getElementById('addEmployee').close()">閉じる</button>
      <button id="btn" type="button" onclick="document.getElementById('addEmployee').close()">登録する</button>
    </div>
  </div>
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