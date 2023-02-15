<script lang="ts" setup>

</script>

<template>
  <div class="ml-12 pt-4">
    <RegistInfoWideCard>
      <template #body>
      <div class="choice">第n希望</div>
      <RegistInfoDivideBar />
      <div class="area">
        Place
      </div>
      <RegistInfoDivideBar />
      <div class="ps">追記：</div>
      <div class="scroll">
        <div class="notes">
          remark
        </div>
      </div>
      </template>
  </RegistInfoWideCard>
  </div>
  <div class="flex justify-end">
    <Button />
  </div>
</template>

<style scoped>
.choice {
  width: 120px;
  height: 100%;
  align-items: top;
  margin-top: 5%;
  margin-left: 3%;
  margin-right: 3%;
  font-weight: 300;
  font-size: 30px;
  line-height: 43px;
  letter-spacing: 0.1em;
  color: #333333;
}
.area {
  display: flex;
  width: 40%;
  height: 100%;
  align-items: center;
  margin-left: 20px;
  margin-right: 20px;
  font-style: normal;
  font-size: 34px;
  font-weight: 300;
  letter-spacing: 0.1em;
  color: #333333;
  white-space: nowrap;
  overflow: auto;
}
.scroll {
  width: 18%;
  height: 100%;
  margin-top: 5%;
  padding-bottom: 3%;
  font-weight: 300;
  font-size: 18px;
  line-height: 26px;
  letter-spacing: 0.1em;
  overflow-wrap: break-word;
  color: #333333;
}

.ps {
  width: 7%;
  height: 100%;
  align-items: top;
  margin-top: 5%;
  font-weight: 300;
  font-size: 18px;
  line-height: 26px;
  letter-spacing: 0.1em;
  color: #333333;
}

.notes {
  width: 100%;
  height: 100%;
  overflow: auto;
}
</style>
