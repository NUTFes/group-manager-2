<template>
  <div class="header-container">
    <header class="header-contents">
      <div class="header-title">
        <img src="~/assets/symbol-mark.svg" />
        <h3><a href="/dashboard"> 参加団体管理アプリ-管理者ページ </a></h3>
      </div>
      <div class="header-option">
        <ul class="header-nav">
          <li class="header-nav-icon">
            <a><span class="material-icons">account_circle</span></a>
            <ul>
              <div class="header-nav-content">
                <h3>{{ user.name }}</h3>
                <p>{{ user.student_id }}</p>
                <p>{{ user.email }}</p>
                <div>
                  <IconButton icon_name="edit" to="/current_user_setting" />
                  <IconButton icon_name="logout" :on_click="logout" />
                </div>
              </div>
            </ul>
          </li>
        </ul>
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
  background-color: #333;
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
}

.header-nav {
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
}

.header-nav > li {
  padding: 2px;
  border-radius: 50%;
}

.header-nav > li > a {
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
}

.header-nav-content {
  flex-flow: column;
  align-items: center;
  justify-content: center;
  padding: 30px 24px 30px 0px;
  height: 100%;
  gap: 10px;
}

.header-nav-content > div {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  gap: 10px;
}

.header-nav-content p {
  margin-top: -10px;
  font-size: 12px;
}

.header-nav ul {
  background: #333;
  width: 250px;
  opacity: 0;
  position: absolute;
  transition: all 0.5s ease;
  top: 60px;
  right: 0;
  margin-left: 100px;
}

.header-nav:hover ul {
  opacity: 1;
}
</style>
