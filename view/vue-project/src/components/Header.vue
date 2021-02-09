<template>
  <div>
    <v-app-bar app color="#FAFAFA" dark>
      <v-container>
        <v-row>
          <v-col cols="1"></v-col>
          <v-col cols="1" align-self="center">
            <router-link to="/mypage">
              <v-img :src="logoImage"> </v-img>
            </router-link>
          </v-col>
          <v-col cols="8"></v-col>
          <v-col cols="1" align-self="center">
            <v-menu open-on-hover offset-y>
              <template v-slot:activator="{ on, attrs }">
                <v-btn text color="#757575" dark v-bind="attrs" v-on="on">
                  <v-icon large>mdi-account-circle-outline</v-icon>
                  <v-icon>mdi-chevron-down</v-icon>
                </v-btn>
              </template>
              <v-list dense>
                <v-list-item>
                  <v-list-item-content>
                    <v-list-item-title>
                      <b>ユーザープロファイル</b>
                    </v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
                <v-list-item>
                  <v-list-item-content>
                    <v-list-item-title>
                      <b>パーソナル設定</b>
                    </v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
                <v-list-item @click="signOut">
                  <v-list-item-content>
                    <v-list-item-title>
                      <v-icon class="pr-2" size="30">mdi-logout</v-icon
                      ><b>ログアウト</b>
                    </v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </v-list>
            </v-menu>
          </v-col>
          <v-col cols="1"></v-col>
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
