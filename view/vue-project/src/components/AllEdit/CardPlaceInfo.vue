<template>
<body id="font">
  <div>
    <div class="card">
      <span class="red"/>
      <div class="choice">
        第1希望
      </div>
      <span class="line"/>
      <div class="area">
        事務棟エリア
      </div>
      <div class="ps">
        追記：
      </div>
      <div class="notes">
        火を使います。例の如く火事になるかもしれません。ご了承ください。
      </div>
      <button class="button">
        <div class="edit">編集</div>
      </button>
    </div>
  </div>
</body>
</template>

<style scoped>
#font{
  font-family: 'Noto Sans JP';
  font-style: normal;
}
.card {
  display: flex;
  width: 1026px;
  height: 149px;
  margin: auto;
  background: #fff;
  box-shadow: 0px 4px 10px 1px rgba(0, 0, 0, 0.25);
}
.red{
  display: inline-block;
  width: 18px;
  background: #F71E35;
}
.choice{
  margin-top: 14px;
  margin-left: 21px;
  margin-right: 16px;
  font-family: 'Noto Sans JP';
  font-style: normal;
  font-weight: 300;
  font-size: 30px;
  line-height: 43px;
  letter-spacing: 0.1em;
  color: #333333;
}
.line{
  display: inline-block;
  width: 1px;
  height: 95.5px;
  margin-top: 29px;
  background: #333333;
}
.area{
  display: flex;
  align-items: center;
  margin-left: 30px;
  font-weight: 300;
  font-size: 48px;
  line-height: 70px;
  letter-spacing: 0.1em;
  color: #333333;
}
.ps{
  margin-top: 27px;
  margin-left: 4px;
  font-weight: 300;
  font-size: 18px;
  line-height: 26px;
  letter-spacing: 0.1em;
  color: #333333;
}
.notes{
  width: 238px;
  height: 95px;
  margin-top: 27px;
  font-weight: 300;
  font-size: 18px;
  line-height: 26px;
  letter-spacing: 0.1em;
  color: #333333;
}
.button
{
  display: flex;
  width: 131px;
  height: 39px;
  margin-top: 55px;
  background: #62A7FF;
  border-radius: 5px;
}
.edit{
  margin-top: 5px;
  margin-left: 14px;
  font-weight: 350;
  font-size: 18px;
  line-height: 26px;
  letter-spacing: 0.3em;
  color: #FFFFFF;
}
</style>