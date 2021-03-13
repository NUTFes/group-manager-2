<template>
  <div>
    <v-row>
      <v-col>
        <div class="card">
          <v-card flat>
            <v-container>
              <v-row>
                <v-col cols="1"></v-col>
                <v-col cols="10">
                  <v-card-title class="font-weight-bold mt-3">
                    <v-icon v-if="user.role_id == 1" color="red" class="ma-1"
                      >mdi-account-cog</v-icon
                    >
                    <v-icon v-if="user.role_id == 2" color="green"
                      >mdi-account-tie</v-icon
                    >
                    <v-icon v-if="user.role_id == 3" color="blue"
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
        </div>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <div class="card">
          <v-card
            flat
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
                    <v-spacer></v-spacer>
                  </v-card-title>
                </v-col>
                <v-col cols="1"></v-col>
              </v-row>
              <v-row
                ><v-col><chart></chart></v-col
              ></v-row>
            </v-container>
          </v-card>
        </div>
      </v-col>
      <v-col>
        <div class="card">
          <v-card
            flat
            :to="{
              name: 'assign_items',
            }"
          >
            <v-container>
              <v-row>
                <v-col cols="1"></v-col>
                <v-col cols="10">
                  <v-card-title class="font-weight-bold mt-3">
                    <v-icon class="ma-1">mdi-printer</v-icon>
                    書類
                    <v-spacer></v-spacer>
                  </v-card-title>
                </v-col>
                <v-col cols="1"></v-col>
              </v-row>
              <v-row>
                <v-col cols="1"></v-col>
                <v-col cols="10"></v-col>
                <v-col cols="1"></v-col>
              </v-row>
            </v-container>
          </v-card>
        </div>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <div class="card">
          <v-card
            flat
            :to="{
              name: 'assign_items',
            }"
          >
            <v-container>
              <v-row>
                <v-col cols="1"></v-col>
                <v-col cols="10">
                  <v-card-title class="font-weight-bold mt-3">
                    <v-icon color="red" class="ma-1">mdi-account-cog</v-icon>
                    会場一覧
                    <v-spacer></v-spacer>
                  </v-card-title>
                  <hr class="mt-n3" />
                </v-col>
                <v-col cols="1"></v-col>
              </v-row>
              <v-row>
                <v-col cols="1"></v-col>
                <v-col cols="10">
                  <v-row> </v-row>
                  あ
                  <v-divider></v-divider>
                  あ
                  <v-row> </v-row>
                </v-col>
                <v-col cols="1"></v-col>
              </v-row>
            </v-container>
          </v-card>
        </div>
      </v-col>
      <v-col>
        <div class="card">
          <v-card
            flat
            :to="{
              name: 'assign_items-id',
              params: {
                id: 1,
              },
            }"
          >
            <v-container>
              <v-row>
                <v-col cols="1"></v-col>
                <v-col cols="10">
                  <v-card-title class="font-weight-bold mt-3">
                    <v-icon color="red" class="ma-1">mdi-account-cog</v-icon>
                    物品一覧
                    <v-spacer></v-spacer>
                  </v-card-title>
                  <hr class="mt-n3" />
                </v-col>
                <v-col cols="1"></v-col>
              </v-row>
              <v-row>
                <v-col cols="1"></v-col>
                <v-col cols="10">
                  <v-row> </v-row>
                  あ
                  <v-divider></v-divider>
                  あ
                  <v-row> </v-row>
                </v-col>
                <v-col cols="1"></v-col>
              </v-row>
            </v-container>
          </v-card>
        </div>
      </v-col>
      <v-col>
        <div class="card">
          <v-card
            flat
            :to="{
              name: 'assign_items-id',
              params: {
                id: 1,
              },
            }"
          >
            <v-container>
              <v-row>
                <v-col cols="1"></v-col>
                <v-col cols="10">
                  <v-card-title class="font-weight-bold mt-3">
                    <v-icon color="red" class="ma-1">mdi-account-cog</v-icon>
                    ユーザー一覧
                    <v-spacer></v-spacer>
                  </v-card-title>
                  <hr class="mt-n3" />
                </v-col>
                <v-col cols="1"></v-col>
              </v-row>
              <v-row>
                <v-col cols="1"></v-col>
                <v-col cols="10">
                  <v-row> </v-row>
                  あ
                  <v-divider></v-divider>
                  あ
                  <v-row> </v-row>
                </v-col>
                <v-col cols="1"></v-col>
              </v-row>
            </v-container>
          </v-card>
        </div>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import Header from "~/components/Header.vue";
import Menu from "~/components/Menu.vue";
import axios from "axios";
import Chart from "./Chart_Stock";

export default {
  components: {
    Chart,
    Header,
    Menu,
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
    };
  },
  mounted() {
    this.$axios
      .get("api/v1/users/get_user_detail", {
        headers: {
          "Content-Type": "application/json",
          "access-token": localStorage.getItem("access-token"),
          client: localStorage.getItem("client"),
          uid: localStorage.getItem("uid"),
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
  },
};
</script>
