<template>
  <transition name="fade" appear>
    <div class="delete-modal" @click.self="$emit('close')">
      <div class="delete-modal__container" @click.self="$emit('close')">
        <div class="delete-modal__box">
          <h2>{{ title }}</h2>
          <div class="delete-modal_content">
            <h4>本当に削除しますか？</h4>
          </div>
          <Row>
            <slot name="method"></slot>
          </Row>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      required: false,
      default: "追加",
    },
  },
};
</script>

<style>
.delete-modal_content input,
.delete-modal_content textarea {
  color: var(--accent-2);
  border: 1px solid var(--accent-3);
  padding: 15px;
  width: 500px;
  transition: all 0.5s 0s ease;
}

.delete-modal_content input:focus,
.delete-modal_content textarea:focus {
  border: 1px solid var(--accent-0);
  z-index: 20;
  outline: 0;
}

.delete-modal_content select {
  color: var(--accent-0);
  border: 1px solid var(--accent-3);
  padding: 15px;
  width: 500px;
  transition: all 0.5s 0s ease;
}

.delete-modal_content select:focus {
  border: 1px solid var(--accent-0);
  z-index: 20;
  outline: 0;
}

.delete-modal__box h2 {
  color: var(--accent-5);
}

.delete-modal_content h3 {
  color: var(--accent-5);
  font-size: 16px;
  font-weight: 300;
}

.delete-modal_content h4 {
  color: var(--accent-5);
}

.delete-modal_content form {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-flow: column;
  gap: 25px;
}

.delete-modal_content div {
  display: flex;
  align-items: flex-start;
  justify-content: center;
  flex-flow: column;
  gap: 10px;
}

.default-option {
  color: red;
}

.delete-modal {
  top: 0;
  left: 0;
  position: fixed;
  height: 100%;
  width: 100%;
  z-index: 11;
  background-color: rgba(51, 51, 51, 0.3);
  overflow: auto;
}
.delete-modal__container {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.delete-modal__box {
  width: 600px;
  z-index: 15;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-flow: column;
  padding: 50px 50px;
  color: #fff;
  background: radial-gradient(
    ellipse at top left,
    rgba(251, 251, 251, 0.9),
    rgba(251, 251, 251, 0.8)
  );
  backdrop-filter: blur(4px);
  gap: 30px;
}

.delete-modal_content {
  width: 100%;
  height: 100%;
  padding: 50px;
  justify-content: center;
  align-items: center;
  display: flex;
  flex-flow: column;
  gap: 20px;
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
