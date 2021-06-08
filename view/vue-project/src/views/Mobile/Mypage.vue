<template>
  <div>
    <v-row class="px-0">
      <v-col class="mx-0">
        <!-- <DashBoard v-if="isMobile === false"/> -->
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-row>
          <v-col>
            <div v-for="(regist, i) in regist_info" :key="i">
              <MobileRegist :num="i" :regist="regist" @reload="reload()" />
              <v-container>
                <v-row>
                  <v-col cols="4"></v-col>
                  <v-col cols="4">
                    <v-btn
                        v-if='regist.group.group_category_id === 1 && regist.employees[0].name === "-9999" && addEmployee && addFoodProduct &&addPurchaseList'
                        block 
                        dark 
                        color="purple accent-2"
                        rounded
                        elevation = "0"
                        @click="set_group_id(regist.group.id)"
                    >
                      <v-icon class="pr-2 pb-1">mdi-baguette</v-icon>{{ regist.group.name }}の販売食品を追加する
                    </v-btn>
                  </v-col>
                  <v-col cols="4"></v-col>
                </v-row>
              </v-container>
            </div>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
    <v-container>
      <v-row>
        <v-col class="text-center">
          <v-btn
              v-if="isRegistGroup"
              dark color="purple accent-2"
                   rounded
                   elevation = "0"
                   to="/mobile_group"
                   >
                   <v-icon class="pr-2">mdi-plus</v-icon>参加団体を追加する
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
    <br>
  </div>
</template>

<script>
import DashBoard from "@/components/Mobile/DashBoard.vue";
import Regist from "@/components/Mobile/Regist.vue";
import MobileRegist from "@/components/Mobile/MobileRegist.vue";
import axios from "axios";
export default {
  components: {
    DashBoard,
    Regist,
    MobileRegist
  },
  data() {
    return {
      data: [
        localStorage.getItem("access-token"),
        localStorage.getItem("client"),
        localStorage.getItem("uid")
      ],
      isMobile: false,
      mobile: [],
      users: [],
      regist_info: [],
      isRegistGroup: [],
      addEmployee: [],
      addFoodProduct: [],
      addPurchaseList: [],
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
    },
    set_group_id: function(group_id){
      localStorage.setItem("group_id", group_id)
      this.$router.push('regist_food_booths')
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
        this.addEmployee = response.data[0].add_employee;
        this.addFoodProduct = response.data[0].add_food_product;
        this.addPurchaseList = response.data[0].add_purchase_list;
        console.log(response);
      });

    console.log(this.isRegistGroup);
  }
};
</script>
