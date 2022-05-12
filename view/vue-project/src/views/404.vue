<template>
  <div>
    <div class="notfound-message">
      お探しのページは見つかりません
    </div>
    <div style="text-align:center">
      <button @click="backTopPage" class="notfound-button">トップページに戻る</button>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    backTopPage: function() {
      this.$router.push("/")
    }
  }
}
</script>

<style scoped>
.notfound-message {
  font-size: 48px;
  text-align: center;
  margin-top: 50px;
}
.notfound-button {
  text-align: center;
  background-color: #00AFCC;
  border-radius: 5px;
  color: #fff;
  padding: 3%;
  width: 360px;
  height: 80px;
  margin-top: 60px;
  margin-left: auto;
  margin-right: auto;
}
</style>