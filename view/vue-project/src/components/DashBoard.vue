<template>
  <div class="dashboard-card">
    <div class="dashboard-content">
      <span class="dashboard-title">{{ user.name }} 様</span>
      <div class="dashboard-detail">
        <p>技大祭に参加していただき誠にありがとうございます。<br />登録情報の確認や変更が行えます。入力締め切りはお守りいただくよう、よろしくお願いします。</p>
      </div>
      <div style="padding-bottom: 20px; padding-top: 30px">
      <p style="font-size: 20px">各種操作</p>
        <button v-if="registInfo.length != 0" @click="goRegistEdit" class="dashboard-button">登録情報の確認はこちらから</button>
        <button v-if="isRegistGroup && registInfo.length == 0" @click="goRegistGroup" class="dashboard-button">参加団体の登録はこちらから</button>
      </div>
      <div>
        <li @click="toUserInfo" class="dashboard-link">ユーザー情報</li>
        <li @click="toEditUserInfo" class="dashboard-link">ユーザー情報編集</li>
        <li @click="toResetPassword" class="dashboard-link">パスワード変更</li>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      user: [],
    };
  },
  props: {
    isRegistGroup: Boolean,
    registInfo: Array,
  },
  methods: {
    toUserInfo() {
      this.$store.commit("acceptUserInfoPermission");
      this.$router.push("/profile");
    },
    toEditUserInfo() {
      this.$store.commit("acceptEditUserInfoPermission");
      this.$router.push("/edit_user_info");
    },
    toResetPassword() {
      this.$store.commit("acceptResetPasswordPermission");
      this.$router.push("/password_reset");
    },
    goRegistGroup: function() {
      this.$store.commit("acceptRegistGroupPermission");
      this.$router.push("/regist_group");
    },
    goRegistEdit: function() {
      this.$store.commit("acceptRegistEditPermission");
      this.$router.push("regist_edit");
    }
  },
  mounted() {
    const url = process.env.VUE_APP_URL + "/api/v1/users/show";
    axios
      .get(url, {
        headers: {
          "Content-Type": "application/json",
          "access-token": localStorage.getItem("access-token"),
          "client": localStorage.getItem("client"),
          "uid": localStorage.getItem("uid"),
        },
      })
      .then((response) => {
        this.user = response.data.data;
      });
  },
};
</script>

<style scoped>
.dashboard-card {
  background-color: #eceff1;
}
.dashboard-content {
  text-align: left;
  padding: 2%;
}
.dashboard-title {
  color: #333333;
  font-size: 24px;
  font-weight: bold;
}
.dashboard-detail {
  color: #333333;
  padding-top: 2%;
  font-size: 16px;
}
.dashboard-link {
  font-size: 18px;
  list-style: none;
  color: #e040fb;
  cursor: pointer;
  display: inline-block;
  margin-right: 2%;
}
.dashboard-link:hover {
  color: #e040fb;
  font-weight: bold;
}
.dashboard-button {
  text-align: center;
  width: calc(100% / 2.5);
  margin-right: 2%;
  border: solid 1px #ef4df3;
  border-radius: 5px;
  padding: 1%;
  color: #ffffff;
  background-color: #ef4df3;
}
.dashboard-button:hover {
  background-color: #D500F9;
  color: #ffffff;
  border: solid 1px #D500F9;
}
</style>