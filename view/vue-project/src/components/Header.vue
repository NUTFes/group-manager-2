<template>
  <div>
    <header>
      <div class="header-content">
        <span class="header-title" @click="backMyPage">技大祭 {{ year }}</span>
        <span class="header-menu"><li @click="signOut">ログアウト</li></span>
      </div>
    </header>
  </div>
</template>

<script>
import axios from "axios";
import logo from "@/assets/logo.svg";
export default {
  data() {
    return {
      drawer: null,
      data: [
        localStorage.getItem("access-token"),
        localStorage.getItem("client"),
        localStorage.getItem("uid"),
      ],
      users: [],
      logoImage: logo,
      year: null,
    };
  },
  mounted() {
    let currentTime = new Date();
    this.year = currentTime.getFullYear();
    const url = process.env.VUE_APP_URL + "/api/v1/users/show";
    axios
      .get(url, {
        headers: {
          "Content-Type": "application/json",
          "access-token": localStorage.getItem("access-token"),
          client: localStorage.getItem("client"),
          uid: localStorage.getItem("uid"),
        },
      })
      .then((response) => {
        this.users = response.data.data;
      });
  },
  methods: {
    backMyPage: function () {
      this.$router.push("/mypage");
    },
    signOut: function () {
      const url = process.env.VUE_APP_URL + "/api/auth/sign_out";
      axios
        .delete(url, {
          headers: {
            "Content-Type": "application/json",
            "access-token": localStorage.getItem("access-token"),
            client: localStorage.getItem("client"),
            uid: localStorage.getItem("uid"),
          },
        })
        .then(
          this.$router.push("/"),
          localStorage.removeItem("access-token"),
          localStorage.removeItem("client"),
          localStorage.removeItem("uid")
        );
    },
  },
};
</script>

<style scoped>
header {
  width: 100%;
  height: 60px;
  background: #ffffff;
  border-bottom: solid 1px #d3d3d3;
  box-sizing: border-box;
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
}
.header-content {
  text-align: center;
  display: flex;
  margin-left: auto;
  margin-right: auto;
  width: 1000px;
  overflow: hidden;
}
.header-title {
  text-align: left;
  font-size: 24px;
  color: #333333;
  font-weight: bold;
  cursor: pointer;
  float: left;
}
.header-menu {
  color: #333333;
  float: left;
  list-style: none;
  margin-top: auto;
  margin-bottom: auto;
  margin-left: auto;
  cursor: pointer;
}
</style>