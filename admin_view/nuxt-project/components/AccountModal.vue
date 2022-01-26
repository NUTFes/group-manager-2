<template>
  <transition name="fade">
    <div class="modal" v-show="showContent">
      <div class="modal__container" @click.self="closeModal">
        <div class="modal__box">
          <h6 v-if="user.role_id == 1" class="developer">
            Developer
            <hr />
          </h6>
          <h3>{{ user.name }}</h3>
          <h6 v-if="user.role_id == 2">Manager</h6>
          <h6 v-if="user.role_id == 3">User</h6>
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
  mounted() {
    this.$axios
      .get("api/v1/users/get_user_detail", {
        headers: {
          "Content-Type": "application/json",
          "access-token": localStorage.getItem("access-token"),
          client: localStorage.getItem("client"),
          uid: localStorage.getItem("uid"),
        },
      })
      .then((response) => {
        this.user = response.data.user;
        this.role = response.data.role;
        this.grade = response.data.grade;
        this.department = response.data.department;
        this.student_id = response.data.student_id;
        this.tel = response.data.tel;
      });
    this.$axios
      .get("api/v1/dashboard", {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        this.dashboard_data = response.data;
      });
  },
  methods: {
    closeModal: function () {
      this.showContent = false;
    },
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
.modal {
  top: 0;
  left: 0;
  position: fixed;
  height: 100%;
  width: 100%;
  z-index: 11;
}
.modal__container {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: end;
  align-items: start;
  padding-top: 60px;
}

.modal__box {
  z-index: 12;
  margin-top: 0px;
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
  gap: 10px;
}

.modal__action {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
}

.developer {
  margin-top: -5px;
  color: red;
}
hr {
  border-color: red;
}

.fade-enter-active,
.fade-leave-active {
  will-change: opacity;
  transition: opacity 100ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
