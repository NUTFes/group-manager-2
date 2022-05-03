<template>
  <body id="font">
    <div>
      <div class="card">
        <span class="red" />
        <div class="date">
          11月11日
        </div>
        <span class="line" />
        <div class="weather">
          晴
        </div>
        <span class="line" />
        <div class="stage">
          {{regist}}
        </div>
        <button class="button">
          <div class="edit">編集</div><br>
          <div class="delete">削除</div>
        </button>
      </div>
    </div>
  </body>
</template>

<script>
export default {
  props: {
    regist: String,
  },
};
</script>

<style scoped>
#font {
  font-family: "Noto Sans JP";
  font-style: normal;
}
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
.red {
  position: absolute;
  left: 0;
  display: inline-block;
  width: 18px;
  height: 100%;
  background: #f71e35;
}
.date {
  display: flex;
  align-items: center;
  margin-left: 30px;
  margin-right: 25px;
  font-style: normal;
  font-weight: 300;
  font-size: 56px;
  line-height: 43px;
  letter-spacing: 0.1em;
  color: #333333;
}
.line {
  display: inline-block;
  width: 1px;
  height: 95.5px;
  background: #333333;
}
.weather {
  display: flex;
  margin-left: 20px;
  margin-right: 20px;
  font-weight: 300;
  font-size: 56px;
  line-height: 80px;
  letter-spacing: 0.1em;
  color: #333333;
}
.stage {
  width: 300x;
  margin-right: 27px;
  margin-left: 27px;
  font-weight: 300;
  font-size: 25px;
  line-height: 26px;
  letter-spacing: 0.1em;
  text-align: center;
  color: #333333;
}
.first { 
  text-align: left;
}
.second {
  margin-top: 15px;
  text-align: left;
}
.button {
  width: 120px;
  height: 80px;
  margin-top: 5px;
  margin-left: 18px;
  border-radius: 5px;
}
.edit {
  font-weight: 350;
  font-size: 18px;
  line-height: 30px;
  letter-spacing: 0.3em;
  background: #62a7ff;
  color: #ffffff;
}
.delete {
  font-weight: 350;
  font-size: 18px;
  line-height: 30px;
  letter-spacing: 0.3em;
  background: #FF6262;
  color: #ffffff;
}
</style>  