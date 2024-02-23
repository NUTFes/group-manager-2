<template>
  <transition name="fade" appear>
    <div class="assign-item-add-modal" @click.self="$emit('close')">
      <div class="assign-item-add-modal__container" @click.self="$emit('close')">
        <div class="assign-item-add-modal__box">
          <h2>{{ title }}</h2>
          <div class="assign-item-add-modal_content">
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
.assign-item-add-modal_content input:focus,
.assign-item-add-modal_content textarea:focus {
  border: 1px solid var(--accent-7);
  z-index: 20;
  outline: 0;
}
.assign-item-add-modal_content select:focus {
  border: 1px solid var(--accent-7);
  z-index: 20;
  outline: 0;
}
.assign-item-add-modal__box h2 {
  color: var(--accent-5);
}
.assign-item-add-modal_content h3 {
  color: var(--accent-5);
  font-size: 16px;
  font-weight: 500;
}
.assign-item-add-modal_content form {
  width: 100%;
  height: 100%;
  display: flex;
  flex-flow: column;
  gap: 25px;
}
.default-option {
  color: red;
}
.assign-item-add-modal {
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
.assign-item-add-modal__container {
  width: 100%;
  min-height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.assign-item-add-modal__box {
  z-index: 15;
  display: flex;
  width:80%;
  max-width: 600px;
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
.assign-item-add-modal_content {
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
