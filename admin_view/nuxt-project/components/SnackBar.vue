<template>
  <transition name="fade" appear>
    <div class="snack-modal" @click.self="$emit('close')">
      <div class="snack-modal__container" @click.self="$emit('close')">
        <div class="snack-modal__box" @click.self="$emit('close')">
          <div class="snack-modal_content">
            <slot></slot>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {};
</script>

<style>
.snack-modal_content h3 {
  font-size: 16px;
  font-weight: 300;
}

.default-option {
  color: red;
}

.snack-modal {
  top: 0;
  left: 0;
  position: fixed;
  height: 100%;
  width: 100%;
  z-index: 11;
  overflow: auto;
}
.snack-modal__container {
  width: 100%;
  min-height: 100%;
  padding: 20px;
  display: flex;
  justify-content: flex-end;
  align-items: flex-end;
}

.snack-modal__box {
  padding: 20px 40px;
  z-index: 15;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-flow: column;
  psnacking: 50px 50px;
  color: #fff;
  background: radial-gradient(
    ellipse at top left,
    rgba(51, 51, 51, 0.9),
    rgba(51, 51, 51, 0.8)
  );
  backdrop-filter: blur(4px);
  gap: 30px;
}

.snack-modal_content {
  font-weight: 500;
  color: var(--accent-2);
  width: 100%;
  height: 100%;
  padding: 10px 20px;
  letter-spacing: 2px;
  background: linear-gradient(
    135deg,
    var(--primary) 0%,
    var(--button-secondary) 100%
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  border-bottom: 1px solid var(--accent-3);
  display: flex;
  flex-flow: column;
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
