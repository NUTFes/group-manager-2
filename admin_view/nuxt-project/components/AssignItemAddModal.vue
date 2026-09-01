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
          <div class="assign-item-add-modal__actions" aria-label="割り当て追加の操作">
            <NoButton class="btn-secondary" iconName="close" :on_click="() => $emit('close')">キャンセル</NoButton>
            <slot name="method"></slot>
          </div>
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
  margin: 0;
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
  box-sizing: border-box;
  display: flex;
  width: min(90vw, 900px);
  justify-content: center;
  align-items: stretch;
  flex-flow: column;
  padding: 32px;
  color: #fff;
  background: radial-gradient(
    ellipse at top left,
    rgba(251, 251, 251, 0.9),
    rgba(251, 251, 251, 0.8)
  );
  backdrop-filter: blur(4px);
  border: 1px solid rgba(255, 255, 255, 0.8);
  border-radius: 12px;
  box-shadow: 0 24px 60px rgba(15, 23, 42, 0.24);
  gap: 24px;
  max-height: calc(100vh - 120px);
  overflow-y: auto;
}
.assign-item-add-modal_content {
  width: 100%;
  height: 100%;
  display: flex;
  flex-flow: column;
  gap: 20px;
}
.assign-item-add-modal__actions {
  align-items: center;
  border-top: 1px solid rgba(100, 116, 139, 0.24);
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  justify-content: flex-end;
  padding-top: 20px;
  width: 100%;
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
