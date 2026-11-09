<template>
  <div class="reauth-page">
    <div class="reauth-box">
      <h1>再度ログインしてください</h1>
      <p>
        ログイン情報の有効期限が切れたか、認証に失敗しました。ログイン画面に戻って再度ログインしてください。
      </p>
      <button type="button" class="reauth-button" @click="goToLogin">
        ログイン画面に戻る
      </button>
    </div>
  </div>
</template>

<script>
export default {
  layout: "empty",
  methods: {
    goToLogin() {
      if (this.$auth?.reset) {
        this.$auth.reset();
      }
      [
        "auth.strategy",
        "auth._token.local",
        "access-token",
        "client",
        "uid",
        "token-type",
      ].forEach((key) => {
        localStorage.removeItem(key);
      });
      this.$router.push("/");
    },
  },
};
</script>

<style scoped>
.reauth-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background: #f5f5f5;
  box-sizing: border-box;
}

.reauth-box {
  width: min(520px, 100%);
  padding: 40px;
  background: #ffffff;
  border: 1px solid var(--accent-2);
  box-sizing: border-box;
  text-align: center;
}

.reauth-box h1 {
  margin: 0;
  color: var(--accent-5);
  font-size: 24px;
  font-weight: 600;
}

.reauth-box p {
  margin: 20px 0 28px;
  color: var(--accent-7);
  font-size: 14px;
  line-height: 1.8;
}

.reauth-button {
  min-height: 44px;
  padding: 0 20px;
  border: 1px solid var(--button-primary);
  border-radius: 4px;
  background: var(--button-primary);
  color: #ffffff;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
}

.reauth-button:hover {
  opacity: 0.9;
}
</style>
