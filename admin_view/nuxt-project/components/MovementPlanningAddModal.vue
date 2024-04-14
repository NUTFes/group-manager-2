<template>
  <transition name="fade" appear>
    <div class="movement-planning-add-modal" @click.self="$emit('close')">
      <div
        class="movement-planning-add-modal__container"
        @click.self="$emit('close')"
      >
        <div class="movement-planning-add-modal__box">
          <h2>{{ title }}</h2>
          <div class="movement-planning-add-modal__content">
            <form @submit.prevent="$emit('submit', newPlan)">
              <!-- Form Slot -->
              <slot name="form"></slot>
              <!-- Actions Slot -->
              <div class="movement-planning-add-modal__actions">
                <slot name="method"></slot>
              </div>
            </form>
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
      default: "移動計画の 追加",
    },
  },
  data() {
    return {
      newPlan: {
        source: "",
        destination: "",
        itemName: "",
        quantity: 0,
        time: "",
      },
    };
  },
};
</script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active in <2.1.8 */ {
  opacity: 0;
}

.movement-planning-add-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(51, 51, 51, 0.3);
  display: flex;
  justify-content: center;
  align-items: center;
}

.movement-planning-add-modal__container {
  background-color: white;
  border-radius: 8px;
  max-width: 500px;
  width: 100%;
  padding: 20px;
}

.movement-planning-add-modal__box {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.movement-planning-add-modal__content {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.movement-planning-add-modal__content label {
  font-weight: bold;
  margin-bottom: 5px;
}

.movement-planning-add-modal__content input {
  padding: 15px;
  border: 1px solid var(--accent-5);
  border-radius: 4px;
  color: var(--accent-7);
  transition: all 0.5s 0s ease;
}

.movement-planning-add-modal__actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.movement-planning-add-modal__actions button {
  padding: 15px 30px;
  border-radius: var(--button-radius);
  font-size: 14px;
  letter-spacing: 2px;
  color: var(--accent-0);
  display: flex;
  justify-content: center;
  align-items: center;
  border: none;
  transition: all 0.2s 0s ease;
  z-index: 0;
  gap: 10px;
  position: relative;
}

.movement-planning-add-modal__actions button[type="submit"] {
  background: linear-gradient(135deg, var(--button-primary) 0%, var(--button-secondary) 100%);
}

.movement-planning-add-modal__actions button[type="button"] {
  background: linear-gradient(135deg, #ff7070 0%, #e38ad5 100%);
}

.movement-planning-add-modal__actions button:hover:before {
  opacity: 0;
}

.movement-planning-add-modal__actions button:active {
  box-shadow: 0 0px 0px rgba(0, 0, 0, 0.25);
}

.movement-planning-add-modal__actions button:before {
  border-radius: var(--button-radius);
  content: "";
  width: 100%;
  height: 100%;
  position: absolute;
  z-index: -1;
  left: 0;
  transition: 0.5s;
  background: linear-gradient(45deg, var(--primary) 0%, var(--button-secondary) 100%);
}
</style>
