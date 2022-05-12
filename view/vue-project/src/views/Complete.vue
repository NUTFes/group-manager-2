<template>
  <div>
    <div class="complete-message">
      登録が完了しました<br>
      技大祭へのご参加ありがとうございます
    </div>
    <div class="complete-button">
      <button @click="backTopPage">マイページへ</button>
    </div>
    
  </div>
</template>

<script>
export default {
  methods: {
    backTopPage: function() {
      this.$store.commit("rejectCompletePermission");
      this.$router.push("/mypage")
    }
  }
}
</script>

<style scoped>
.complete-message {
  font-size: 48px;
  text-align: center;
  margin-top: 50px;
}
.complete-button {
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