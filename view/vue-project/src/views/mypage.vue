<template>
  <div>
    <DashBoard />
    <UserInfo />
    <News />
    <div v-if="this.regist_info.length === 0">
      <v-progress-circular
        indeterminate
        color="primary"
        ></v-progress-circular>
    </div>
    <div v-else>
      <div v-for="(regist, i) in regist_info" :key="i">
        <Regist :num="i" :regist="regist" @reload="reload()" />
      </div>
    </div>
    <br />
    <div style="text-align:center" v-if="isRegistGroup">
      <v-container>
        <v-row>
          <v-col cols="4"></v-col>
          <v-col cols="4">
            <v-btn
              block dark color="purple accent-2"
               dark
               rounded
               elevation = "0"
               to="/group"
             >
           <v-icon class="pr-2 pb-1">mdi-plus</v-icon>参加団体を追加する
            </v-btn>
          </v-col>
          <v-col cols="4"></v-col>
        </v-row>
      </v-container>
    </div>
    <br>
  </div>
</template>

<script>
import Header from "@/components/Header.vue";
import DashBoard from "@/components/DashBoard.vue";
import UserInfo from "@/components/UserInfo.vue";
import News from "@/components/News.vue";
import Regist from "@/components/Regist.vue";
import axios from "axios";
export default {
  components: {
    DashBoard,
    UserInfo,
    Header,
    News,
    Regist
  },
  data() {
    return {
      data: [
        localStorage.getItem("access-token"),
        localStorage.getItem("client"),
        localStorage.getItem("uid")
      ],
      users: [],
      regist_info: [],
      isRegistGroup: []
    };
  },
  methods: {
    signOut: function() {
      const url = process.env.VUE_APP_URL + "/api/auth/sign_out";
      axios
        .delete(url, {
          headers: {
            "Content-Type": "application/json",
            "access-token": localStorage.getItem("access-token"),
            client: localStorage.getItem("client"),
            uid: localStorage.getItem("uid")
          }
        })
        .then(
          this.$router.push("/"),
          localStorage.removeItem("access-token"),
          localStorage.removeItem("client"),
          localStorage.removeItem("uid")
        );
    },
    reload() {
      const regist_info_url = process.env.VUE_APP_URL + "/api/v1/current_user/regist_info";
      axios.get(regist_info_url, {
          headers: {
            "Content-Type": "application/json",
            "access-token": localStorage.getItem("access-token"),
            "client": localStorage.getItem("client"),
            "uid": localStorage.getItem("uid")
          }
        })
        .then(response => {
          console.log(response)
          this.regist_info = response.data;
        });
    }
  },
  mounted() {
    const url = process.env.VUE_APP_URL + "/api/v1/users/show";
    axios.get(url, {
      headers: {
        "Content-Type": "application/json",
        "access-token": localStorage.getItem("access-token"),
        client: localStorage.getItem("client"),
        uid: localStorage.getItem("uid")
      }
    })
    .then(response => {
      this.users = response;
    });

    const regist_info_url = process.env.VUE_APP_URL + "/api/v1/current_user/regist_info";
    axios
      .get(regist_info_url, {
        headers: {
          "Content-Type": "application/json",
          "access-token": localStorage.getItem("access-token"),
          "client": localStorage.getItem("client"),
          "uid": localStorage.getItem("uid")
        }
      })
      .then(response => {
        console.log("aaaaaaaaaaa")
        console.log(response)
        this.regist_info = response.data;
      });

    const settingurl = process.env.VUE_APP_URL + "/user_page_settings";
    axios
      .get(settingurl, {
        headers: {
          "Content-Type": "application/json",
          "access-token": localStorage.getItem("access-token"),
          client: localStorage.getItem("client")
        }
      })
      .then(response => {
        this.isRegistGroup = response.data[0].is_regist_group;
        console.log(response);
      });

    console.log(this.isRegistGroup);
  }
};
</script>
