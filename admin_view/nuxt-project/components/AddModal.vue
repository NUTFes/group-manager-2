<template>
  <transition name="fade" appear>
    <div class="modal">
      <div class="modal__container" @click.self="$emit('close')">
        <div class="modal__box">
          <h2>参加団体の追加</h2>
          <div class="modal_content">
            <form>
              <div class="form-content">
                <h3>団体名</h3>
                <input v-model="message" placeholder="入力してください" />
              </div>
              <div class="form-content">
                <h3>団体名</h3>
                <input v-model="message" placeholder="入力してください" />
              </div>
              <div class="form-content">
                <h3>団体名</h3>
                <input v-model="message" placeholder="入力してください" />
              </div>
              <div class="form-content">
                <h3>団体名</h3>
                <input v-model="message" placeholder="入力してください" />
              </div>
              <div class="form-content">
                <h3>団体名</h3>
                <input v-model="message" placeholder="入力してください" />
              </div>
              <div class="form-content">
                <h3>団体名</h3>
                <input v-model="message" placeholder="入力してください" />
              </div>
              <CommonButton> 登録 </CommonButton>
            </form>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      user: [],
      user_detail: [],
      role: [],
      grade: [],
      department: [],
      student_id: [],
      tel: [],
      rate: [],
      groups_length: [],
      dashboard_data: [],
    };
  },
  props: {
    showContent: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
};
</script>

<style scoped>
input {
  color: var(--accent-2);
  border: 1px solid var(--accent-3);
  padding: 15px;
  width: 500px;
}

h3 {
  font-size: 16px;
  font-weight: 300;
}

form {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: start;
  align-items: center;
  flex-flow: column;
  gap: 25px;
}

.form-content {
  display: flex;
  align-items: start;
  justify-content: center;
  flex-flow: column;
  gap: 10px;
}

.modal {
  top: 0;
  left: 0;
  position: fixed;
  height: 100%;
  width: 100%;
  z-index: 11;
  background-color: rgba(51, 51, 51, 0.3);
}
.modal__container {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal__box {
  height: 80%;
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

.modal_content {
  overflow: auto;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: start;
  align-items: center;
  flex-flow: column;
  gap: 20px;
}

.modal__action {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
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
