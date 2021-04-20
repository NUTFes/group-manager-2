<template>
  <div>
    <v-row>
      <v-col>
        <v-card flat class="mx-15">
          <v-container>
            <v-row>
              <v-col cols="1"></v-col>
              <v-col cols="10">
                <v-card-title class="font-weight-bold mt-3">
                  <v-icon v-if="user.role_id == 1" color="red" class="ma-1"
                    >mdi-account-cog</v-icon
                  >
                  <v-icon v-if="user.role_id == 2" color="green" class="ma-1"
                    >mdi-account-tie</v-icon
                  >
                  <v-icon v-if="user.role_id == 3" color="blue" class="ma-1"
                    >mdi-account</v-icon
                  >
                  {{ user.name }}
                  <v-spacer></v-spacer>
                </v-card-title>
                <hr class="mt-n3" />
              </v-col>
              <v-col cols="1"></v-col>
            </v-row>
            <v-row>
              <v-col cols="1"></v-col>
              <v-col cols="10">
                <v-row>
                  <v-col cols="1" align="center"
                    ><v-icon>mdi-account-outline</v-icon></v-col
                  >
                  <v-col cols="3">学籍番号</v-col>
                  <v-col cols="8">{{ student_id }}</v-col>
                </v-row>
                <v-divider></v-divider>
                <v-row>
                  <v-col cols="1" align="center"
                    ><v-icon>mdi-school-outline</v-icon></v-col
                  >
                  <v-col cols="3">学年</v-col>
                  <v-col cols="8">{{ grade }}</v-col>
                </v-row>
                <v-divider></v-divider>
                <v-row>
                  <v-col cols="1" align="center"
                    ><v-icon>mdi-school</v-icon></v-col
                  >
                  <v-col cols="3">課程</v-col>
                  <v-col cols="8">{{ department }}</v-col>
                </v-row>
                <v-divider></v-divider>
                <v-row>
                  <v-col cols="1" align="center"
                    ><v-icon>mdi-phone</v-icon></v-col
                  >
                  <v-col cols="3">電話番号</v-col>
                  <v-col cols="8">{{ tel }}</v-col>
                </v-row>
                <v-divider></v-divider>
                <v-row>
                  <v-col cols="1" align="center"
                    ><v-icon>mdi-email</v-icon></v-col
                  >
                  <v-col cols="3">メールアドレス</v-col>
                  <v-col cols="8">{{ user.email }}</v-col>
                </v-row>
              </v-col>
              <v-col cols="1"></v-col>
            </v-row>
          </v-container>
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <update/>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-card
          flat
          class="ml-15"
          :to="{
            name: 'groups',
          }"
        >
          <v-container>
            <v-row>
              <v-col cols="1"></v-col>
              <v-col cols="10">
                <v-card-title class="font-weight-bold mt-3">
                  <v-icon class="ma-1">mdi-account-group</v-icon>
                  参加団体
                </v-card-title>
                <v-divider></v-divider>
              </v-col>
              <v-col cols="1"></v-col>
            </v-row>
            <v-row>
              <v-col cols="1"></v-col>
              <v-col cols="10">
                  <chart1></chart1>
              </v-col
            ></v-row>
            <v-col cols="1"></v-col>
          </v-container>
        </v-card>
      </v-col>
      <v-col>
        <v-card 
           flat
           class="mr-15"
           :to="{
                name: 'users'
                }"
           >
           <v-row>
             <v-col cols=1></v-col>
             <v-col cols=10>
               <v-card-title class="font-weight-bold mt-3">
                 <v-icon class="ma-1">mdi-account-circle</v-icon>
                 ユーザー数
               </v-card-title>
               <v-divider></v-divider>
               <v-row>
                 <v-col cols=6>
                   <br><br>
                   <v-card-text><div style="font-size:100px; text-align:center">{{ dashboard_data.all_user_num }}</div><br><br><br><div style="font-size:20px; text-align:center">people</div></v-card-text>
                 </v-col>
                 <v-col cols=6>
                   <v-card-text><v-chip color="red" text-color="white"><v-avatar left class="red darken-4">{{ dashboard_data.developer_num }}</v-avatar>developers</v-chip></v-card-text>
                   <v-card-text><v-chip color="green" text-color="white"><v-avatar left class="green darken-4">{{ dashboard_data.manager_num }}</v-avatar>managers</v-chip></v-card-text>
                   <v-card-text><v-chip color="blue" text-color="white"><v-avatar left class="blue darken-4">{{ dashboard_data.user_num }}</v-avatar>users</v-chip></v-card-text>
                 </v-col>
               </v-row>
             </v-col>
             <v-col cols=1></v-col>
           </v-row>
        </v-card>
        <br>
        <v-card
          flat
          class="mr-15"
          :to="{
            name: 'assign_items',
          }"
        >
          <v-container>
            <v-row>
              <v-col cols="1"></v-col>
              <v-col cols="10">
                <v-card-title class="font-weight-bold mt-3">
                  <v-icon class="ma-1">mdi-cube</v-icon>
                  物品割り当て
                </v-card-title>
                <v-divider></v-divider>
              </v-col>
              <v-col cols="1"></v-col>
            </v-row>
            <v-row>
              <v-col cols="1"></v-col>
              <v-col cols="5">在庫情報</v-col>
              <v-col cols="5">割り当て情報</v-col>
              <v-col cols="1"></v-col>
            </v-row>
            <v-row>
              <v-col cols="1"></v-col>
              <v-col cols="5"><chart2></chart2></v-col>
              <v-col cols="5"><chart3></chart3></v-col>
              <v-col cols="1"></v-col>
            </v-row>
          </v-container>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import Header from "~/components/Header.vue";
import Menu from "~/components/Menu.vue";
import axios from "axios";
import Chart1 from "./Chart_Group";
import Chart2 from "./Chart_Stock";
import Chart3 from "./Chart_Assign";
import Update from '../components/Update.vue';

export default {
  components: {
    Chart1,
    Chart2,
    Chart3,
    Header,
    Menu,
    Update,
  },
  data() {
    return {
      user: [],
      user_detail: [],
      role: [],
      grade: [],
      department: [],
      student_id: [],
      tel: [],
      rate: [],
      groups_length: [],
      dashboard_data: [],
    };
  },
  mounted() {
    this.$axios
      .get("api/v1/users/get_user_detail", {
        headers: {
          "Content-Type": "application/json",
          "access-token": localStorage.getItem("access-token"),
          "client": localStorage.getItem("client"),
          "uid": localStorage.getItem("uid"),
        },
      })
      .then((response) => {
        this.user = response.data.user;
        this.role = response.data.role;
        this.grade = response.data.grade;
        this.department = response.data.department;
        this.student_id = response.data.student_id;
        this.tel = response.data.tel;
      });
    this.$axios
      .get("api/v1/dashboard", {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        this.dashboard_data = response.data;
      });
  },
};
</script>
