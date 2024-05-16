<template>
  <transition name="fade" appear>
    <div class="notification-modal" @click.self="$emit('close')">
      <div class="notification-modal__container" @click.self="$emit('close')">
        <div class="notification-modal__box">
          <Row justify="start">
            <slot></slot>
          </Row>
          <div class="notification-modal__time-line">
            <div v-for="content in contents" :key="content.id">
              <Row>
                <h4>{{ content.status }}</h4>
                <h5>{{ content.created_at }}</h5>
              </Row>
              <br />
              <p>{{ content.text }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  data() {
    return {
      // NEW: 新規機能追加, FIX: バグ修正, RELEASE: リリース, OTHER: その他
      contents: [
        {
          id: 1,
          status: "RELEASE",
          text: "バージョン 2.0.0をリリースしました",
          created_at: "2022/2/1",
        },
        {
          id: 2,
          status: "NEW",
          text: "UIを全く新しくしました",
          created_at: "2022/2/1",
        },
      ],
    };
  },
};
</script>

<style>
.notification-modal_content input,
.notification-modal_content textarea {
  width: 100%;
  height: 150px;
  color: var(--accent-2);
  border: 1px solid var(--accent-3);
  padding: 15px;
  transition: all 0.5s 0s ease;
}

.notification-modal_content input:focus,
.notification-modal_content textarea:focus {
  border: 1px solid var(--accent-0);
  z-index: 20;
  outline: 0;
}

.notification-modal_content select {
  color: var(--accent-0);
  border: 1px solid var(--accent-3);
  padding: 15px;
  width: 500px;
  transition: all 0.5s 0s ease;
}

.notification-modal_content select:focus {
  border: 1px solid var(--accent-0);
  z-index: 20;
  outline: 0;
}

.notification-modal_content h3 {
  font-size: 16px;
  font-weight: 300;
}

.notification-modal_content form {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-flow: column;
  gap: 25px;
}

.notification-modal_content div {
  display: flex;
  align-items: flex-start;
  justify-content: center;
  flex-flow: column;
  gap: 10px;
}

.default-option {
  color: red;
}

.notification-modal {
  top: 0;
  right: 0;
  position: fixed;
  height: 100%;
  padding-top: 60px;
  width: 100%;
  z-index: 11;
}
.notification-modal__container {
  height: 100%;
  width: 100%;
  min-height: 100%;
  display: flex;
  justify-content: flex-end;
  align-items: flex-start;
}

.notification-modal__box {
  width: 400px;
  height: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-flow: column;
  padding: 15px;
  z-index: 15;
  color: #fff;
  background: radial-gradient(
    ellipse at top left,
    rgba(51, 51, 51, 0.9),
    rgba(51, 51, 51, 0.8)
  );
  backdrop-filter: blur(4px);
  gap: 30px;
}

.notification-modal_content {
  width: 100%;
  display: flex;
  flex-flow: column;
  gap: 20px;
}
.notification-modal__time-line {
  width: 100%;
  height: 100%;
  padding: 0px 15px;
  gap: 30px;
  display: flex;
  flex-flow: column;
  overflow: auto;
}

.fade-enter-active,
.fade-leave-active {
  will-change: opacity;
  transition: opacity 200ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
