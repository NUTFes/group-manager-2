<script lang="ts" setup>
</script>

<template>
  <RegistInfoWideCard>
    <template #body>
      <div class="item">
        机
      </div>
      <p class="box">
        <span class="number">
          10
        </span>
        <span class="pieces"> 個 </span>
      </p>
    </template>
    <template #method>
      <EditButton />

    </template>
  </RegistInfoWideCard>
</template>


<style scoped>
.item {
  position: absolute;
  width: 347px;
  height: 72px;
  top: 32px;
  right: 19px;
  margin: auto;
  font-weight: 350;
  font-size: 36px;
  line-height: 52px;
  text-align: center;
}

.box {
  display: flex;
  justify-content: end;
  align-items: end;
  position: absolute;
  height: 74px;
  width: 126px;
  bottom: 15px;
  left: 52px;
}

.number {
  font-weight: 350;
  font-size: 48px;
  letter-spacing: 0.1em;
  line-height: 34.75px;
}

.pieces {
  font-weight: 350;
  font-size: 24px;
  letter-spacing: 0.1em;
  line-height: 19px;
}

.button {
  position: absolute;
  right: 12.97px;
  bottom: 8.74px;
}

.button1 {
  display: flex;
  width: 126.77px;
  height: 37.74px;
  margin: 6.26px;
  background: #62a7ff;
  border-radius: 5px;
}

.button2 {
  display: flex;
  width: 126.77px;
  height: 37.74px;
  margin: 6.26px;
  background: #ff6262;
  border-radius: 5px;
}

.edit {
  margin-top: 5px;
  margin-left: 14px;
  font-weight: 350;
  font-size: 18px;
  line-height: 26px;
  letter-spacing: 0.3em;
  color: #ffffff;
}
</style>
