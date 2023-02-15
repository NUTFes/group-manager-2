<script lang="ts" setup>
</script>

<template>
  <RegistInfoWideCard>
    <template #body>
      <div class="date">11月20日</div>
      <RegistInfoDivideBar />
      <div class="weather">晴</div>
      <RegistInfoDivideBar />
      <div class="stage">
        <div class="first">第1希望‣ 体育館</div>
        <div class="second">第2希望‣ A講義室</div>
      </div>
    </template>
  </RegistInfoWideCard>
</template>

<style>
.date {
  display: flex;
  align-items: center;
  margin-left: 30px;
  margin-right: 25px;
  font-style: normal;
  font-weight: 300;
  font-size: 48px;
  line-height: 43px;
  letter-spacing: 0.1em;
  color: #333333;
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
  width: 460px;
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
</style>
