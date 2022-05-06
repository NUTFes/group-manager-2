<template>
  <div>
    <v-row>
      <v-col cols="2" />
      <v-col cols="8">
        <DashBoard />
      </v-col>
      <v-col cols="2" />
    </v-row>
    <v-row>
      <v-col cols="2" />
      <v-col cols="8">
        <News />
      </v-col>
      <v-col cols="2" />
    </v-row>
    <v-row>
      <v-col cols="2" />
      <v-col cols="8">
        <RegistAlarm />
      </v-col>
      <v-col cols="2" />
    </v-row>
    <v-row>
      <v-col cols="2" />
      <v-col cols="8">
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
      </v-col>
      <v-col cols="2" />
    </v-row>
      <v-row>
        <v-col cols="4" />
        <v-col cols="4">
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
        </v-col>
        <v-col cols="4" />
      </v-row>
      <v-row>
        <v-col cols="4" />
        <v-col cols="4">
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
        </v-col>
        <v-col cols="4" />
      </v-row>
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
