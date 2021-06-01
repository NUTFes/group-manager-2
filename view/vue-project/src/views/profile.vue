<template>
 <v-row>
            <v-col cols="2"></v-col>
            <v-col cols="8" align="center">
              <v-card-title class="justify-center">
                <h1 style="color:#333333">ユーザー情報</h1>
              </v-card-title>
                <br>
                <v-divider></v-divider>
                <br>
             
              <v-card-title class="justify-center">
                <h2>{{ user.user.name}}<br /></h2>
              </v-card-title>
 
              <v-card class="mx-auto" outlined>
              <v-card-title class="justify-center">
               <h3 style="color:#333333"> メールアドレス<br />
               <v-icon class="mr-2">mdi-email</v-icon>{{ user.user.email }}<br /></h3>
              </v-card-title>

              <v-card-title class="justify-center">
                <h3 style="color:#333333"> 学籍番号<br />
                <v-icon class="mr-2">mdi-card-account-details-outline</v-icon>{{ user.student_id}}<br /></h3>
              </v-card-title>

              <v-card-title class="justify-center">
                <h3 style="color:#333333"> 電話番号<br />
                <v-icon class="mr-2">mdi-phone</v-icon>{{ user.tel }}<br /></h3>
              </v-card-title>

              <v-card-title class="justify-center">
                <h3 style="color:#333333"> 学科<br />
                <v-icon class="mr-2"> mdi-fireplace-off</v-icon>{{ user.department }}<br /></h3>
              </v-card-title>

              <v-card-title class="justify-center">
                <h3 style="color:#333333"> 学年<br />
                <v-icon class="mr-2">mdi-school</v-icon>{{ user.grade}}<br /></h3>
              </v-card-title>
    
</v-card>

  </v-col>
      <v-col cols="4"></v-col>

            <v-card-text> </v-card-text>

  </v-row>
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
  },
};
</script>

