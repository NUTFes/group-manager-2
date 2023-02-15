<script lang="ts" setup>

</script>

<template>
  <RegistInfoWideCard>
    <template #body>
      <div class="choice">
        <div>
          <h6>名前</h6>
        </div>
        <div class="notes">
          技大太郎
          <!-- {{ regist.name }} -->
        </div>
      </div>
      <div class="area">
        <div>
          <h6>所属</h6>
        </div>
        <div class="notes">情報経営・システム</div>
        <div>B2</div>
        <div>21100491</div>
      </div>
      <RegistInfoDivideBar />
      <div class="ps">
        <h4>詳細情報</h4>
        <div class="notes">
          <div class="character2">email</div>
          <div class="character2">000-1234-5678</div>
        </div>
      </div>
    </template>
  </RegistInfoWideCard>
</template>

<style>
.choice {
  width: 250px;
  /* position: absolute; */
  top: 10px;
  left: 40px;
  font-weight: 300;
  font-size: 20px;
  margin: 5% 3% 0 3%;
  letter-spacing: 0.1em;
  color: #333333;
  padding: 0 auto;
}

.area {
  /* position: absolute; */
  top: 10px;
  left: 360px;
  font-weight: 300;
  font-size: 20px;
  letter-spacing: 0.1em;
  color: #333333;
}

.ps {
  /* position: absolute; */
  top: 10px;
  width: 400px;
  left: 700px;
  font-weight: 300;
  font-size: 15px;
  line-height: 30px;
  letter-spacing: 0.1em;
  color: #333333;
}

.button {
  /* position: absolute; */
  left: 1050px;
  display: flex;
  background: #62a7ff;
  border-radius: 5px;
}

.edit {
  padding: 5px 30px;
  margin: 0 0 0.2px;
  font-weight: 350;
  font-size: 18px;
  line-height: 26px;
  letter-spacing: 0.3em;
  color: #ffffff;
}

.notes {
  padding-top: 10px;
  display: inline-block;
  overflow-x: auto;
  width: 100%;
}

.character2 {
  width: 300px;
  margin-top: auto;
  font-weight: 300;
  font-size: 18px;
  line-height: 26px;
  letter-spacing: 0.1em;
  color: #000000;
  white-space: nowrap;
  overflow: auto;
}
</style>
