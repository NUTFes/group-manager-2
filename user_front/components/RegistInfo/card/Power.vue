<script lang="ts" setup>

</script>

<template>
  <RegistInfoWideCard>
    <template #body>
      <div class="product">
        Item
      </div>
      <span class="w-1" />
      <span class="w-5" />
      <RegistInfoDivideBar />
      <div class="power">
        <div class="number">100 </div>
        <div class="watt">[W]</div>
      </div>
      <RegistInfoDivideBar />
      <div>
        <div class="detail">
          <div class="character1">メーカー</div>
          <canvas class="triangle" />
          <div class="character2">manufacturer</div>
        </div>
        <div class="detail">
          <div class="character1">型番</div>
          <canvas class="triangle" />
          <div class="character2">model</div>
        </div>
      </div>
      <span class="w-12" />
    </template>
    <template #method></template>
  </RegistInfoWideCard>
</template>

<style>
.product {
  width: 37%;
  text-align: center;
  font-weight: 300;
  font-size: 48px;
  line-height: 70px;
  letter-spacing: 0.1em;
  margin-left: 22px;
  white-space: nowrap;
  overflow: auto;
}

.line {
  display: inline-block;
  width: 1px;
  height: 95.5px;
  background: #333333;
}

.power {
  display: flex;
  width: 18%;
  text-align: center;
  justify-content: end;
  margin: 12px;
}

.number {
  font-weight: 300;
  font-size: 64px;
  line-height: 93px;
  letter-spacing: 0.1em;
  color: #000000;
}

.watt {
  margin-top: 50px;
  font-weight: 300;
  font-size: 18px;
  line-height: 26px;
  letter-spacing: 0.1em;
  color: #000000;
}

.detail {
  display: flex;
  align-items: center;
  margin-left: 15px;
  margin-top: 10px;
}

.triangle {
  width: 0;
  height: 0;
  margin: 6px;
  border: 5px solid transparent;
  border-left: 7px solid #333333;
}

.character1 {
  width: 80px;
  height: 26px;
  font-weight: 300;
  font-size: 18px;
  line-height: 26px;
  text-align: center;
  letter-spacing: 0.1em;
  color: #000000;
}

.character2 {
  width: 120px;
  margin-top: auto;
  font-weight: 300;
  font-size: 18px;
  line-height: 26px;
  letter-spacing: 0.1em;
  color: #000000;
  white-space: nowrap;
  overflow: auto;
}

.column {
  flex-flow: column;
  align-items: center;
}
</style>
