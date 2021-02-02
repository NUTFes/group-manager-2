<template>
  <div>
    <v-app-bar app color="#FAFAFA" height="70" dark>
      <v-row>
        <v-col cols="2"></v-col>
        <v-col>
          <router-link to="/mypage">
            <v-img :src="logoImage"> </v-img>
          </router-link>
        </v-col>
        <v-spacer></v-spacer>

        <v-col cols="2">
          <v-menu open-on-hover offset-y>
            <template v-slot:activator="{ on, attrs }">
              <v-btn color="black" dark v-bind="attrs" v-on="on" outlined>
                {{ users.name }}
              </v-btn>
            </template>

            <v-list>
              <v-list-item @click="signOut">
                <v-list-item-avatar>
                  <v-icon>mdi-logout</v-icon>
                </v-list-item-avatar>
                <v-list-item-content>
                  <v-list-item-title>ログアウト</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-menu>
        </v-col>
        <v-col cols="1"></v-col>
      </v-row>
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
