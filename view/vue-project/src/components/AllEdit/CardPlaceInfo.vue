<template>
  <body id="font">
    <div>
      <div class="card">
        <span class="red"/>
        <div class="choice">
          第{{ n }}希望
        </div>
        <span class="line"/>
        <div class="area">
          {{ place }}
        </div>
        <div class="ps">
          追記：
        </div>
        <div class="notes">
          {{ remark }}
        </div>
        <button class="button">
          <div class="edit">編集</div>
        </button>
      </div>
    </div>
  </body>
</template>

<script>
export default {
  props: {
    n: Number,
    place: String,
    remark: String,
  },
};
</script>

<style scoped>
.card {
  display: flex;
  align-items: center;
  position: relative;
  width: 1026px;
  height: 149px;
  margin-left: 9.12%;
  background: #fff;
  box-shadow: 0px 4px 10px 1px rgba(0, 0, 0, 0.25);
}
.red{
  position: absolute;
  left: 0;
  display: inline-block;
  width: 18px;
  height: 100%;
  background: #F71E35;
}
.choice{
  position: absolute;
  top: 14px;
  left: 39px;
  font-weight: 300;
  font-size: 30px;
  line-height: 43px;
  letter-spacing: 0.1em;
  color: #333333;
}
.line{
  position: absolute;
  left: 189px;
  display: inline-block;
  width: 1px;
  height: 95.5px;
  background: #333333;
}
.area{
  position: absolute;
  left: 219px;
  font-weight: 300;
  font-size: 48px;
  line-height: 70px;
  letter-spacing: 0.1em;
  color: #333333;
}
.ps{
  position: absolute;
  top: 27px;
  left: 543px;
  font-weight: 300;
  font-size: 18px;
  line-height: 26px;
  letter-spacing: 0.1em;
  color: #333333;
}
.notes{
  position: absolute;
  top: 27px;
  left: 604px;
  width: 238px;
  height: 95px;
  font-weight: 300;
  font-size: 18px;
  line-height: 26px;
  letter-spacing: 0.1em;
  color: #333333;
}
.button
{
  position: absolute;
  left: 860px;
  display: flex;
  width: 131px;
  height: 39px;
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