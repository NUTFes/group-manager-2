<template>
  <div class="header-container">
    <header class="header-contents">
      <div class="header-title">
        <img src='~/assets/symbol-mark.svg'/>
        <h3><a href='/dashboard'> 参加団体管理アプリ-管理者ページ </a></h3>
      </div>
      <div class="header-option">
        <IconButton icon_name='account_circle' :on_click="logout"/>
      </div>
    </header>
  </div>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      drawer: false,
      user: [],
      content: [],
      memos: [],
      users: [],
    };
  },
  mounted() {
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
  },
};
</script>

<style>
img {
  height: 40px;
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
  background-color: #333;
}
.header-contents {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
}

.header-title {
  width: 300px;
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
}
</style>
