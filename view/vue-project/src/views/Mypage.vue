<template>
  <div>
    <div class="mypage-card" style="padding-bottom: 10px">
      <DashBoard :isRegistGroup="isRegistGroup" />
    </div>
    <div v-for="r in regist_info" :key="r" style="padding-bottom: 10px">
      <RegistAlarm :registInfo="r" :setting="setting" />
    </div>
    <div style="padding-bottom: 10px">
      <News />
    </div>
  </div>
</template>

<script>
import DashBoard from "@/components/DashBoard.vue";
import News from "@/components/News.vue";
import RegistAlarm from "@/components/RegistAlarm.vue";
import axios from "axios";
export default {
  components: {
    DashBoard,
    News,
    RegistAlarm,
  },
  data() {
    return {
      data: [
        localStorage.getItem("access-token"),
        localStorage.getItem("client"),
        localStorage.getItem("uid"),
      ],
      users: [],
      setting: null,
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
  },
  mounted() {
    // 直リンク対策
    if (this.$store.state.myPagePermission) {
      console.log("ok");
    } else {
      console.log("reject");
      this.$router.push("/");
    }

    this.$store.commit("rejectAllPermission");

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
        this.regist_info = response.data.data;
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
        this.setting = response.data.data[0];
        this.isRegistGroup = response.data.data[0].is_regist_group;
        this.addEmployee = response.data.data[0].add_employee;
        this.addFoodProduct = response.data.data[0].add_food_product;
        this.addPurchaseList = response.data.data[0].add_purchase_list;
      });
  },
};
</script>

<style scoped>
.mypage-card {
  padding-bottom: 2vh;
}
</style>