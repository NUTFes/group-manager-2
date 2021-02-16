<template>
  <div>
    <v-row>
      <v-col>
        <div class="card">
          <v-card-text>
            <router-link to="/users">ユーザー一覧</router-link> >
            {{ user.name }}
          </v-card-text>
        </div>
      </v-col>
    </v-row>

    <v-row>
      <v-col>
        <div class="card">
          <v-card flat>
            <v-row>
              <v-col cols="1"></v-col>
              <v-col cols="10">
                <v-card-title class="font-weight-bold mt-3">
                  <v-icon v-if="user.role_id == 1" color="red" class="ma-1">mdi-account-cog</v-icon>
                  <v-icon v-if="user.role_id == 2" color="green">mdi-account-tie</v-icon>
                  <v-icon v-if="user.role_id == 3" color="blue">mdi-account</v-icon>
                  {{ user.name }}
                  <v-spacer></v-spacer>
                  <v-btn text @click="dialog = true"><v-icon class="ma-5" color="#E040FB">mdi-pencil</v-icon></v-btn>
                </v-card-title>
                <hr class="mt-n3" />
                <v-simple-table class="my-9">
                  <template v-slot:default>
                    <tbody>
                      <tr>
                        <th>学籍番号：</th>
                        <td class="caption">{{ detail.student_id }}</td>
                      </tr>
                      <tr>
                        <th>学年：</th>
                        <td class="caption">{{ grade }}</td>
                      </tr>
                      <tr>
                        <th>課程：</th>
                        <td class="caption">{{ department }}</td>
                      </tr>
                      <tr>
                        <th>電話番号：</th>
                        <td class="caption">{{ detail.tel }}</td>
                      </tr>
                      <tr>
                        <th>登録日時：</th>
                        <td class="caption">
                          {{ user.created_at | format-date }}
                        </td>
                      </tr>
                      <tr>
                        <th>編集日時：</th>
                        <td class="caption">
                          {{ user.updated_at | format-date }}
                        </td>
                        <td v-if="rights == 1">
                          <v-icon color="#E91E63">mdi-pencil</v-icon>
                        </td>
                        <td v-if="rights == 2">
                          <v-icon color="#E91E63">mdi-eye</v-icon>
                        </td>
                      </tr>
                    </tbody>
                  </template>
                </v-simple-table>
              </v-col>
            </v-row>
          </v-card>
        </div>
      </v-col>
    </v-row>

    <v-row v-for="group in groups" :key="group.id">
      <v-col>
        <div class="card">
          <v-card flat v-if="group.user_id === user.id">
            <v-row>
              <v-col cols="1"></v-col>
              <v-col cols="10">
                <v-card-title class="font-weight-bold mt-3">
                  <v-icon>mdi-account-group</v-icon>
                  参加団体情報
                  <v-spacer></v-spacer>
                  <v-btn text @click="dialog = true"><v-icon class="ma-5" color="#E040FB">mdi-pencil</v-icon></v-btn>
                </v-card-title>
                <hr class="mt-n3" />
                <v-simple-table class="my-9">
                  <template v-slot:default>
                    <tbody>
                      <tr>
                        <th>団体名：</th>
                        <td class="caption">{{ group.name }}</td>
                      </tr>
                      <tr>
                        <th>企画名：</th>
                        <td class="caption">{{ group.project_name }}</td>
                      </tr>
                      <tr>
                        <th>活動内容：</th>
                        <td class="caption">{{ group.activity }}</td>
                      </tr>
                      <tr>
                        <th>グループカテゴリ：</th>
                        <td class="caption">{{ group.group_category_id }}</td>
                      </tr>
                      <tr>
                        <th>開催年：</th>
                        <td class="caption">{{ group.fes_year_id }}</td>
                      </tr>
                    </tbody>
                  </template>
                </v-simple-table>
              </v-col>
            </v-row>
          </v-card>
        </div>
      </v-col>
    </v-row>

    <v-row>
      <v-col>
        <v-btn text color="white" to="/users"><v-icon color="#333333">mdi-arrow-left-bold</v-icon>
          <div style="color: #333333">ユーザー一覧に戻る</div></v-btn>
      </v-col>
      <v-col></v-col>
    </v-row>
    <!-- modal window to edit -->
    <v-dialog v-model="dialog" width="1200">
      <v-card>
        <v-row>
          <v-col cols="2"></v-col>
          <v-col cols="8">
            <v-card-title class="font-weight-bold"
                          ><v-icon class="pa-2">mdi-pencil</v-icon>登録情報の編集</v-card-title>
            <v-text-field
              label="氏名"
              background-color="white"
              outlined
              v-model="student_id"
              filled
              clearable
              ></v-text-field>
            <v-select
              label="権限"
              ref="groupCategory"
              v-model="groupCategoryId"
              :menu-props="{
                             top: true,
                             offsetY: true,
                             }"
              item-text="name"
              item-value="id"
              outlined
              ></v-select>
            <v-text-field
              label="学籍番号８桁"
              background-color="white"
              outlined
              v-model="student_id"
              counter="8"
              filled
              clearable
              ></v-text-field>
            <v-text-field
              label="課程（専攻）"
              background-color="white"
              outlined
              v-model="student_id"
              filled
              clearable
              ></v-text-field>
            <v-text-field
              label="団体"
              background-color="white"
              outlined
              v-model="student_id"
              filled
              clearable
              ></v-text-field>
            <v-text-field
              label="電話番号"
              background-color="white"
              outlined
              v-model="student_id"
              filled
              clearable
              ></v-text-field>
            <v-btn color="blue darken-1" block dark @click="submit"
                   >登録</v-btn>
            <v-btn color="blue darken-1" text block @click="cancel">リセット</v-btn>
          </v-col>
          <v-col cols="2"></v-col>
        </v-row>
      </v-card>
    </v-dialog>
        </div>
</template>

<script>
import Header from "~/components/Header.vue";
import Menu from "~/components/Menu.vue";
import axios from "axios";
import { mapState } from "vuex";

export default {
  components: {
    Header,
    Menu,
  },
  fetch({ store }) {
    store.dispatch("getRights");
  },
  computed: {
    ...mapState(["rights"]),
  },
  data() {
    return {
      user: [],
      role: [],
      grade: [],
      department: [],
      detail: [],
      groups: [],
      expand: false,
      dialog: false,
    };
  },
  mounted() {
    const url = "api/v1/users/show_user_detail/" + this.$route.params.id;
    this.$axios
      .get(url, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        this.user = response.data.user;
        this.role = response.data.role;
        this.grade = response.data.grade;
        this.department = response.data.department;
        this.detail = response.data.detail;
      })

      this.$axios.get('groups/', {
      headers: { 
        "Content-Type": "application/json"
      }
    }
    )
      .then(response => {
        this.groups = response.data
      })
  }
}
</script>

<style scoped>
  td{
    width: 70%;
  }
  th{
    width: 30%;
  }
</style>  

<style>
.card {
  padding-left: 1%;
  padding-right: 5%
}
</style>
