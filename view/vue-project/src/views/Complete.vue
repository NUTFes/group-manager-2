<template>
  <div>
    <div class="complete-message">
      {{ message }}<br>
      {{ secondMessage }}
    </div>
    <div style="text-align:center">
      <button @click="backTopPage" class="complete-button">マイページへ</button>
    </div>
    
  </div>
</template>

<script>
export default {
  data() {
    return {
      message: null,
      secondMessage: null,
    }
  },
  mounted() {
    if (this.$store.state.completePermission == false) {
      this.$router.push("/mypage");
    }
    if (this.$route.path == "/complete/regist") {
      this.message = "登録が完了しました";
      this.secondMessage = "技大祭への登録ありがとうございます";
    } else {
      this.message = "参加団体を削除しました";
      this.secondMessage = "";

    }
  },
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