<template>
  <transition name="fade" appear>
    <div class="memo-modal" @click.self="$emit('close')">
      <div class="memo-modal__container" @click.self="$emit('close')">
        <div class="memo-modal__box">
          <Row justify="start">
            <slot></slot>
          </Row>
          <div class="memo-modal_content">
            <textarea v-model="content" placeholder="メモ" />
            <CommonButton
              v-if="content !== ''"
              iconName="add_circle"
              :on_click="submit"
              >投稿</CommonButton
            >
            <CommonButton
              v-else
              disabled
              iconName="add_circle"
              :on_click="submit"
              >投稿</CommonButton
            >
          </div>
          <div class="memo-modal__time-line">
            <div v-for="memo in memos" :key="memo.id">
              <Row>
                <h4>{{ memo.user.name }}</h4>
                <h5>{{ memo.memo.created_at | formatDate }}</h5>
              </Row>
              <p>{{ memo.memo.content }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  props: {
    memos: Array,
  },
  data() {
    return {
      content: "",
      user: null,
    };
  },
  methods: {
    async submit() {
      // ログイン中のユーザーを取得
      const currentUserUrl = "/api/v1/users/show";
      const CurrentUser = await this.$axios.get(currentUserUrl, {
        headers: {
          "Content-Type": "application/json",
          "access-token": localStorage.getItem("access-token"),
          client: localStorage.getItem("client"),
          uid: localStorage.getItem("uid"),
        },
      });
      this.user = CurrentUser.data.data;
      const url = "/memos?content=" + this.content + "&user_id=" + this.user.id;
      const res = await this.$axios.$post(url);
      this.memos.unshift(res.data);
      this.content = "";
    },
  },
};
</script>

<style>
.memo-modal_content input,
.memo-modal_content textarea {
  width: 100%;
  height: 150px;
  color: var(--accent-2);
  border: 1px solid var(--accent-3);
  padding: 15px;
  transition: all 0.5s 0s ease;
}

.memo-modal_content input:focus,
.memo-modal_content textarea:focus {
  border: 1px solid var(--accent-0);
  z-index: 20;
  outline: 0;
}

.memo-modal_content select {
  color: var(--accent-0);
  border: 1px solid var(--accent-3);
  padding: 15px;
  width: 500px;
  transition: all 0.5s 0s ease;
}

.memo-modal_content select:focus {
  border: 1px solid var(--accent-0);
  z-index: 20;
  outline: 0;
}

.memo-modal_content h3 {
  font-size: 16px;
  font-weight: 300;
}

.memo-modal_content form {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-flow: column;
  gap: 25px;
}

.memo-modal_content div {
  display: flex;
  align-items: flex-start;
  justify-content: center;
  flex-flow: column;
  gap: 10px;
}

.default-option {
  color: red;
}

.memo-modal {
  top: 0;
  right: 0;
  position: fixed;
  height: 100%;
  padding-top: 60px;
  width: 100%;
  z-index: 11;
}
.memo-modal__container {
  height: 100%;
  width: 100%;
  min-height: 100%;
  display: flex;
  justify-content: flex-end;
  align-items: flex-start;
}

.memo-modal__box {
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

.memo-modal_content {
  width: 100%;
  display: flex;
  flex-flow: column;
  gap: 20px;
}
.memo-modal__time-line {
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
