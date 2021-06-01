<template>
  <div>
    <v-card class="mx-auto" height="700px" outlined>
      <v-card-title style="background-color: #eceff1" class="title"
        ><v-icon class="pr-2" size="30">mdi-account-circle</v-icon
        ><b>ユーザー情報</b></v-card-title
      >
      <v-row>
        <v-col>
          <v-card-text class="font-weight-bold title">
            {{ user.user.name }}
          </v-card-text>
          <v-card-text class="font-weight-bold subtitle-1">
            <v-icon class="mr-2">mdi-email</v-icon>{{ user.user.email }}<br />
            <v-icon class="mr-2">mdi-account-outline</v-icon>{{ user.student_id
            }}<br />
            <v-icon class="mr-2">mdi-school-outline</v-icon>{{ user.grade
            }}<br />
            <v-icon class="mr-2">mdi-school</v-icon>{{ user.department }}<br />
            <v-icon class="mr-2">mdi-phone</v-icon>{{ user.tel }}
          </v-card-text>
          <v-card-text> </v-card-text>
        </v-col>
      </v-row>
    </v-card>
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
  },
};
</script>
