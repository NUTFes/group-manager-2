<template>
  <div class="dashboard-card">
    <div class="dashboard-content">
      <span class="dashboard-title">{{ user.name }} 様</span>
      <div class="dashboard-detail">
        <p>技大祭に参加していただき誠にありがとうございます。<br />登録情報の確認や変更が行えます。入力締め切りはお守りいただくよう、よろしくお願いします。</p>
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
  border-radius: 5px;
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
</style>