<template>
  <div id="app">
    <h1 class="tytle">
      ユーザー情報
      {{ user.user.name }}様
    </h1>
    <div class="Blank">
      <span>
        メールアドレス:
      </span>
      <nobr>{{ user.user.email }}</nobr>
    </div>
    <div class="Blank">
      <span>
        学籍番号:
      </span>
      <nobr>{{ user.student_id }}</nobr>
    </div>
    <div class="Blank">
      <span>
        電話番号:
      </span>
      <nobr>{{ user.tel }}</nobr>
    </div>
    <div class="Blank">
      <span>
        学科:
      </span>
      <nobr>{{ user.department }}</nobr>
    </div>
    <div class="Blank">
      <span>
        学年:
      </span>
      <nobr>{{ user.grade }}</nobr>
    </div>
    <div class="Blank">
      <router-link to="/mypage"><button>←マイページに戻る</button></router-link>
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
    const url = process.env.VUE_APP_URL + "/api/v1/users/get_user_detail";
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
        this.user = response.data;
      });
    const setting =
    process.env.VUE_APP_URL + "/user_page_settings";
    axios
      .get(setting, {
        headers: {
          "Content-Type": "application/json",
          "access-token": localStorage.getItem("access-token"),
          client: localStorage.getItem("client"),
          uid: localStorage.getItem("uid"),
        },
      })
      .then((response) => {
        this.setting=response.data.data[0];
      });
  },
};
</script>

<style scoped>
  #app{
    margin: 1%;
  }
  span {
    display: inline-block;
    width: 200;
    padding-right: 10px;
  }
  .tytle{
    text-align:center;
    padding:1%;
  }
  .Blank{
    text-align: center;
    margin:1%;
  }
  nobr {
    text-align: center;
    width: 30%;
    height:40px;
    font-size: 25px;
  }
  button{
  color: black;
  font-weight: bold;
  border-radius: 10px;
  cursor: pointer;
  margin: 1%;
  padding:1%;
  }
  button:hover {
    box-shadow: -2px -2px 5px #FFF, 2px 2px 5px #BABECC;
    background-image: linear-gradient(90deg, rgba(247, 93, 139, 1), rgba(254, 220, 64, 1));
    border: white;
  }
  button:active{
    box-shadow: inset 1px 1px 2px #BABECC, inset -1px -1px 2px #FFF;
  }
</style>
