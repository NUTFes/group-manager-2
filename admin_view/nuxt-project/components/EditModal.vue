<template>
  <transition name="fade" appear>
    <div class="edit-modal" @click.self="$emit('close')">
      <div class="edit-modal__container" @click.self="$emit('close')">
        <div class="edit-modal__box">
          <h2>{{ title }}</h2>
          <div class="edit-modal_content">
            <form>
              <slot name="form"></slot>
            </form>
          </div>
          <slot name="method"></slot>
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
.edit-modal_content input,
.edit-modal_content textarea {
  color: var(--accent-5);
  border: 1px solid var(--accent-5);
  padding: 15px;
  width: 500px;
  transition: all 0.5s 0s ease;
}

.edit-modal_content input:focus,
.edit-modal_content textarea:focus {
  border: 1px solid var(--accent-7);
  z-index: 20;
  outline: 0;
}

.edit-modal_content select {
  color: var(--accent-5);
  border: 1px solid var(--accent-5);
  padding: 15px;
  width: 500px;
  transition: all 0.5s 0s ease;
}

.edit-modal_content select:focus {
  border: 1px solid var(--accent-7);
  z-index: 20;
  outline: 0;
}

.edit-modal input[type="radio"] {
  color: initial;
  border: initial;
  padding: initial;
  width: initial;
  transition: initial;
}

.edit-modal input[type="radio"] + label {
  color: initial;
  border: initial;
  padding: initial;
  width: initial;
  transition: initial;
}

.edit-modal__box h2 {
  color: var(--accent-5);
}

.edit-modal_content h3 {
  color: var(--accent-5);
  font-size: 16px;
  font-weight: 500;
}

.edit-modal_content form {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-flow: column;
  gap: 25px;
}

.edit-modal_content div {
  display: flex;
  align-items: flex-start;
  justify-content: center;
  flex-flow: column;
  gap: 10px;
}

.default-option {
  color: red;
}

.edit-modal {
  top: 0;
  left: 0;
  position: fixed;
  padding: 100px;
  height: 100%;
  width: 100%;
  z-index: 11;
  background-color: rgba(51, 51, 51, 0.3);
  overflow: auto;
}
.edit-modal__container {
  width: 100%;
  min-height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.edit-modal__box {
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

.edit-modal_content {
  width: 100%;
  height: 100%;
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
