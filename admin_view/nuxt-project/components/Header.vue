<template>
  <div>
    <AccountModal :showContent="showContent" />
    <div class="header-container">
      <header class="header-contents">
        <div class="header-title">
          <img src="~/assets/symbol-mark.svg" />
          <a href="/dashboard"> 参加団体管理アプリ-管理者ページ </a>
        </div>
        <div class="header-option">
          <IconButton icon_name="notifications" :on_click="openModal" />
          <IconButton icon_name="forum" :on_click="openModal" />
          <IconButton icon_name="account_circle" :on_click="openModal" />
        </div>
      </header>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import AccountModal from "~/components/AccountModal.vue";
export default {
  data() {
    return {
      drawer: false,
      user: [],
      content: [],
      memos: [],
      users: [],
      showContent: false,
    };
  },
  mounted() {
    this.$axios
      .get("api/v1/users/show", {
        headers: {
          "Content-Type": "application/json",
          "access-token": localStorage.getItem("access-token"),
          client: localStorage.getItem("client"),
          uid: localStorage.getItem("uid"),
        },
      })
      .then((response) => {
        this.user = response.data.data;
      });
  },
  methods: {
    open: function () {
      this.$axios
        .get("/memos", {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          this.memos = response.data;
        });
      this.drawer = true;
    },
    submit: function () {
      this.$axios.defaults.headers.common["Content-Type"] = "application/json";
      var params = new URLSearchParams();
      params.append("content", this.content);
      params.append("user_id", this.user.id);
      this.$axios.post("/memos", params).then(
        (response) => {
          this.memos = response.data;
          this.content = "";
        },
        (error) => {
          return error;
        }
      );
    },
    logout() {
      this.$auth.logout();
      localStorage.removeItem("access-token");
      localStorage.removeItem("client");
      localStorage.removeItem("uid");
      this.$router.push("/");
    },
    openModal: function () {
      this.showContent = false;
      this.showContent = true;
    },
  },
};
</script>

<style>
img {
  height: 45px;
  margin: 5px;
}

.header-container {
  position: fixed;
  top: 0;
  height: 60px;
  width: 100%;
  padding: 0px 30px;
  z-index: 2;
  color: white;
  background: radial-gradient(
    ellipse at top left,
    rgba(40, 40, 40, 0.9),
    rgba(40, 40, 40, 0.8)
  );
  backdrop-filter: blur(4px);
}
.header-contents {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
}

.header-title {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.header-option {
  display: flex;
  align-items: center;
  justify-content: end;
  flex-grow: 1;
  gap: 15px;
}
</style>
