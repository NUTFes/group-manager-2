<template>
  <transition name="fade" appear>
    <div class="account-modal" @click.self="$emit('close')">
      <div class="account-modal__container" @click.self="$emit('close')">
        <div class="account-modal__box">
          <Row justify="start">
            <slot></slot>
          </Row>
          <h6 v-if="user.role_id == 1" class="developer">Developer</h6>
          <h6 v-if="user.role_id == 2">Manager</h6>
          <h6 v-if="user.role_id == 3">User</h6>
          <h3>{{ user.name }}</h3>
          <p>{{ user.email }}</p>
          <IconButton icon_name="edit" to="/current_user_setting" />
          <IconButton icon_name="logout" :on_click="logout" />
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
    };
  },
  async mounted() {
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
  },
  methods: {
    logout() {
      this.$auth.logout();
      localStorage.removeItem("access-token");
      localStorage.removeItem("client");
      localStorage.removeItem("uid");
      this.$router.push("/");
    },
  },
};
</script>

<style scoped>
.account-modal_content h3 {
  font-size: 16px;
  font-weight: 300;
}

.account-modal_content div {
  display: flex;
  align-items: start;
  justify-content: center;
  flex-flow: column;
  gap: 10px;
}

.default-option {
  color: red;
}

.account-modal {
  top: 0;
  right: 0;
  position: fixed;
  height: 100%;
  padding-top: 60px;
  width: 100%;
  z-index: 11;
}
.account-modal__container {
  height: 100%;
  width: 100%;
  min-height: 100%;
  display: flex;
  justify-content: end;
  align-items: start;
}

.account-modal__box {
  width: 400px;
  display: flex;
  justify-content: start;
  align-items: center;
  flex-flow: column;
  padding: 30px 15px;
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
