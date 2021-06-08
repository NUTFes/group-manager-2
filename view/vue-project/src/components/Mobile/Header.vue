<template>
  <div
    v-if="
      this.$route.path === '/mobile_welcome' ||
      this.$route.path === '/MobileWelcome' ||
      this.$route.path === '/MobileFirstcustomer' ||
      this.$route.path === '/mobile_mypage' ||
      this.$route.path === '/MobileMypage'
    "
  >
    <v-app-bar app color="header" dark>
      <v-container>
        <v-row justify="center" align-content="center">
          <v-col align-self="center" class="d-inline-flex">
            <router-link to="/mobile_mypage" tabindex="-1">
              <v-img contain :src="logoImage"> </v-img>
            </router-link>
          </v-col>
          <v-col cols="1" align-self="center">
            <v-menu
              open-on-hover
              offset-y
              v-if="
                this.$route.path === '/mobile_welcome' ||
                this.$route.path === '/MobileWelcome' ||
                this.$route.path === '/MobileFirstcustomer' ||
                this.$route.path === '/mobile_mypage' ||
                this.$route.path === '/MobileMypage'
              "
            >
              <template v-slot:activator="{ on, attrs }">
                <v-btn text color="#757575" dark v-bind="attrs" v-on="on">
                  <v-icon large>mdi-account-circle-outline</v-icon>
                  <v-icon>mdi-chevron-down</v-icon>
                </v-btn>
              </template>
              <v-list dense>
                <v-list-item to="/mobile_edit_user_info">
                  <v-list-item-content>
                    <v-list-item-title class="font-weight-bold">
                      <v-icon class="pr-2" size="30">mdi-account-edit</v-icon
                      >ユーザー情報編集
                    </v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
                <v-list-item to="/password_reset">
                  <v-list-item-content>
                    <v-list-item-title class="font-weight-bold">
                      <v-icon class="pr-2" size="30">mdi-lock-reset</v-icon
                      >パスワード変更
                    </v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
                <v-list-item @click="signOut">
                  <v-list-item-content>
                    <v-list-item-title class="font-weight-bold">
                      <v-icon class="pr-2" size="30">mdi-logout</v-icon
                      >ログアウト
                    </v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </v-list>
            </v-menu>
          </v-col>
          <v-col cols="2"></v-col>
        </v-row>
      </v-container>
    </v-app-bar>
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
    };
  },
  mounted() {
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
    signOut: function () {
      axios
        .delete("http://localhost/api/auth/sign_out", {
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
