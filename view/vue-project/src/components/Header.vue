<template>
  <div>
    <header>
      <span class="header-title" @click="backMyPage">技大祭 {{ year }}</span>
      <nav class="gnav">
        <ul class="menu">
          <li @click="signOut">ログアウト</li>
        </ul>
      </nav>
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
  height: 6vh;
  background: #ffffff;
  border-bottom: solid 1px #d3d3d3;
  padding: 20px 50px;
  box-sizing: border-box;
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  padding-left: 40vh;
  padding-right: 40vh;
}
header .gnav .menu {
  display: flex;
}
header .gnav .menu li {
  list-style: none;
  cursor: pointer;
}
header .gnav .menu li + li {
  text-align: right;
  margin-left: 40px;
}
.header-title {
  font-size: 24px;
  color: #333333;
  font-weight: bold;
  cursor: pointer;
}
</style>