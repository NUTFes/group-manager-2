<script lang="ts" setup>

</script>

<template>
  <RegistInfoWideCard>
    <template #body>
      <div class="device">
        <div class="upper">機器▾</div>
        <div class="lower">使用</div>
      </div>
      <RegistInfoDivideBar />
      <div class="music">
        <div class="upper">音楽▾</div>
        <div class="lower">不使用</div>
      </div>
      <RegistInfoDivideBar />
      <div class="permission">
        <div class="upper">撮影▾</div>
        <div class="lower">禁止</div>
      </div>
      <RegistInfoDivideBar />
      <div class="loud_sound">
        <div class="upper">騒音▾</div>
        <div class="lower">無</div>
      </div>
      <RegistInfoDivideBar />
      <div class="content">
        <div class="upper">ステージ内容▾</div>
        <div class="performance">ステージ内容</div>
      </div>
    </template>
  </RegistInfoWideCard>
</template>

<style>
.device {
  width: 120px;
  height: 95.5px;
  align-items: center;
  font-family: "Noto Sans JP";
  margin-left: 25px;
  margin-right: 20px;
  font-style: normal;
  font-weight: 300;
  letter-spacing: 0.1em;
  color: #333333;
}

.upper {
  font-size: 18px;
}

.lower {
  font-size: 35px;
  margin: center;
  text-align: center;
}

.line {
  display: inline-block;
  width: 1px;
  height: 95.5px;
  background: #333333;
}

.music {
  width: 120px;
  height: 95.5px;
  align-items: center;
  font-family: "Noto Sans JP";
  margin-left: 20px;
  margin-right: 20px;
  font-style: normal;
  font-weight: 300;
  letter-spacing: 0.1em;
  color: #333333;
}

.permission {
  width: 80px;
  height: 95.5px;
  align-items: center;
  font-family: "Noto Sans JP";
  margin-left: 15px;
  margin-right: 15px;
  font-style: normal;
  font-weight: 300;
  letter-spacing: 0.1em;
  color: #333333;
}

.loud_sound {
  width: 60px;
  height: 95.5px;
  align-items: center;
  font-family: "Noto Sans JP";
  margin-left: 15px;
  margin-right: 15px;
  font-style: normal;
  font-weight: 300;
  letter-spacing: 0.1em;
  color: #333333;
}

.content {
  width: 350px;
  height: 95.5px;
  align-items: center;
  font-family: "Noto Sans JP";
  margin-left: 15px;
  margin-right: 15px;
  font-style: normal;
  font-weight: 300;
  font-size: 21px;
  letter-spacing: 0.1em;
  overflow-wrap: break-word;
  color: #333333;
}

.performance {
  width: 100%;
  height: 100%;
  margin: auto auto;
  overflow: auto;
}
</style>
