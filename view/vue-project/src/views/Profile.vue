<template>
  <font face="Noto Sans JP" size="5" >
  <div>
    <h2 style="text-align:center"> ユーザー情報</h2>
    <br>
    <hr noshade>
    <br>
    <h1>{{ user.user.name }}</h1>
    <br>
    <div style="font-size:32px;text-align:center">
      <p>{{ user.user_detail.department }}</p>
      <p>学籍番号:{{ user.user_detail.student_id }}</p>
      <p>{{ user.user_detail.grade }}</p>
      <br>
      <p>{{ user.user_detail.tel }}</p>
      <p>{{ user.user.email }}</p>
    </div>
    <br>
    <h5 style="text-align:center">
      <button @click="backMypage" class="profile-button">
        マイページに戻る
      </button>
    </h5>
  </div>
 </font>
</template>


<script>
import axios from 'axios'
export default {
  data() {
    return {
      user:null
    }
  },
  mounted() {
    const url = process.env.VUE_APP_URL + "/api/v1/current_user";
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
      this.user = response.data.data
    })
  },
  methods: {
    backMypage() {
      this.$router.push("/mypage")
    }
  }
}
</script>


<style scoped>
hr {
  height: 0.1rem;
    border-color: #e0e0e0;
}
h5{
  color: #CF4DF3;
}
.profile-button {
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
  border: 1px solid #CF4DF3;
  border-radius: 20rem;
}
</style>