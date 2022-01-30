<template>
  <transition name="fade" appear>
    <div class="add-modal" @click.self="$emit('close')">
      <div class="add-modal__container" @click.self="$emit('close')">
        <div class="add-modal__box">
          <h2>{{ title }}</h2>
          <div class="add-modal_content">
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
.add-modal_content input,
.add-modal_content textarea {
  color: var(--accent-2);
  border: 1px solid var(--accent-3);
  padding: 15px;
  width: 500px;
  transition: all 0.5s 0s ease;
}

.add-modal_content input:focus,
.add-modal_content textarea:focus {
  border: 1px solid var(--accent-0);
  z-index: 20;
  outline: 0;
}

.add-modal_content select {
  color: var(--accent-0);
  border: 1px solid var(--accent-3);
  padding: 15px;
  width: 500px;
  transition: all 0.5s 0s ease;
}

.add-modal_content select:focus {
  border: 1px solid var(--accent-0);
  z-index: 20;
  outline: 0;
}

.add-modal_content h3 {
  font-size: 16px;
  font-weight: 300;
}

.add-modal_content form {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: start;
  align-items: center;
  flex-flow: column;
  gap: 25px;
}

.add-modal_content div {
  display: flex;
  align-items: start;
  justify-content: center;
  flex-flow: column;
  gap: 10px;
}

.default-option {
  color: red;
}

.add-modal {
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
.add-modal__container {
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.add-modal__box {
  z-index: 15;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-flow: column;
  padding: 50px 50px;
  color: #fff;
  background: radial-gradient(
    ellipse at top left,
    rgba(51, 51, 51, 0.9),
    rgba(51, 51, 51, 0.8)
  );
  backdrop-filter: blur(4px);
  gap: 30px;
}

.add-modal_content {
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
