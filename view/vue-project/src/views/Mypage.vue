<template>
  <div>
    <div class="mypage-card">
      <DashBoard />
    </div>
    <div class="mypage-tabs">
      <input id="news" type="radio" name="mypage-tab-item" checked>
      <label class="mypage-tab-item" for="news">お知らせ</label>
      <input id="regist" type="radio" name="mypage-tab-item">
      <label class="mypage-tab-item" for="regist">登録情報</label>
      <input id="alert" type="radio" name="mypage-tab-item">
      <label class="mypage-tab-item" for="alert">未登録</label>

      <div class="mypage-tab-content" id="news-content">
        <div class="mypage-tab-content-description">
          <News />
        </div>
      </div>
      <div class="mypage-tab-content" id="regist-content">
        <div class="mypage-tab-content-description">
        <v-btn
          v-if="isRegistGroup"
          block
          dark
          color="purple accent-2"
          rounded
          elevation="0"
          to="/regist_model"
        >
          <v-icon class="pr-2 pb-1">mdi-plus</v-icon>参加団体を追加する
        </v-btn>
        <br>
        <v-btn
          v-if="isRegistGroup"
          block
          dark
          color="purple accent-2"
          rounded
          elevation="0"
          to="/registEdit"
        >
          <v-icon class="pr-2 pb-1">mdi-pen</v-icon>登録情報をまとめて変更
        </v-btn>
        </div>
      </div>
      <div class="mypage-tab-content" id="alert-content">
        <div class="mypage-tab-content-description">
          <RegistAlarm />
        </div>
      </div>
    </div>
    <div class="mypage-card">
      <div v-for="(regist, i) in regist_info" :key="i">
        <Regist :num="i" :regist="regist" @reload="reload()" />
          <v-row>
            <v-col cols="4" />
            <v-col cols="4">
              <v-btn
                v-if="
                  regist.group.group_category_id === 1 &&
                  regist.employees[0].name === '-9999' &&
                  addEmployee &&
                  addFoodProduct &&
                  addPurchaseList
                "
                block
                dark
                color="purple accent-2"
                rounded
                elevation="0"
                @click="set_group_id(regist.group.id)"
              >
                <v-icon class="pr-2 pb-1">mdi-baguette</v-icon>
                {{ regist.group.name }}の販売食品を追加する
              </v-btn>
            </v-col>
            <v-col cols="4" />
          </v-row>
        </div>
    </div>
  </div>
</template>

<script>
import DashBoard from "@/components/DashBoard.vue";
import News from "@/components/News.vue";
import RegistAlarm from "@/components/RegistAlarm.vue";
import Regist from "@/components/Regist.vue";
import axios from "axios";
export default {
  components: {
    DashBoard,
    News,
    RegistAlarm,
    Regist,
  },
  data() {
    return {
      data: [
        localStorage.getItem("access-token"),
        localStorage.getItem("client"),
        localStorage.getItem("uid"),
      ],
      users: [],
      regist_info: [],
      info: [],
      isRegistGroup: [],
      addEmployee: [],
      addFoodProduct: [],
      addPurchaseList: [],
    };
  },
  methods: {
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
    reload() {
      const regist_info_url =
        process.env.VUE_APP_URL + "/api/v1/current_user/current_regist_info";
      axios
        .get(regist_info_url, {
          headers: {
            "Content-Type": "application/json",
            "access-token": localStorage.getItem("access-token"),
            "client": localStorage.getItem("client"),
            "uid": localStorage.getItem("uid"),
          },
        })
        .then((response) => {
          this.regist_info = response.data;
        });
    },
    set_group_id: function (group_id) {
      localStorage.setItem("group_id", group_id);
      this.$router.push("regist_food_booths");
    },
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
        this.users = response;
      });

    const regist_info_url = process.env.VUE_APP_URL + "/api/v1/current_user/current_regist_info";
    axios
      .get(regist_info_url, {
        headers: {
          "Content-Type": "application/json",
          "access-token": localStorage.getItem("access-token"),
          "client": localStorage.getItem("client"),
          "uid": localStorage.getItem("uid"),
        },
      })
      .then((response) => {
        this.regist_info = response.data;
      });

    const settingurl = process.env.VUE_APP_URL + "/user_page_settings";
    axios
      .get(settingurl, {
        headers: {
          "Content-Type": "application/json",
          "access-token": localStorage.getItem("access-token"),
          "client": localStorage.getItem("client"),
        },
      })
      .then((response) => {
        this.isRegistGroup = response.data[0].is_regist_group;
        this.addEmployee = response.data[0].add_employee;
        this.addFoodProduct = response.data[0].add_food_product;
        this.addPurchaseList = response.data[0].add_purchase_list;
      });
  },
};
</script>

<style scoped>
.mypage-card {
  padding-bottom: 2vh;
}
.mypage-tabs {
  margin-top: 50px;
  padding-bottom: 40px;
  background-color: #fff;
  width: 1000px;
  margin: 0 auto;
}
.mypage-tab-item {
  width: calc(100%/3);
  height: 50px;
  border-bottom: 2px solid #e040fb;;
  background-color: #ffffff;
  line-height: 50px;
  font-size: 16px;
  text-align: center;
  color: #565656;
  display: block;
  float: left;
  text-align: center;
  font-weight: bold;
  transition: all 0.2s ease;
}
.mypage-tab-item:hover {
  opacity: 0.75;
}
/*ラジオボタンを全て消す*/
input[name="mypage-tab-item"] {
  display: none;
}
.mypage-tab-content {
  display: none;
  padding-top: 20px;
  clear: both;
  overflow: hidden;
}
/*選択されているタブのコンテンツのみを表示*/
#news:checked ~ #news-content,
#regist:checked ~ #regist-content,
#alert:checked ~ #alert-content {
  display: block;
}

/*選択されているタブのスタイルを変える*/
.mypage-tabs input:checked + .mypage-tab-item {
  background-color: #eceff1;
  color: #e040fb;
}
</style>