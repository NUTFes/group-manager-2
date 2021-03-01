<template>
  <div>
    <v-row>
      <v-col>
        <div class="card">
          <v-card-text>
            <div class="breadcrumbs">
              <ul>
                <li>
                  <div class="breadcrumbs-item">
                    <router-link to="/groups">参加団体一覧</router-link>
                  </div>
                </li>
                <li>
                  <div class="breadcrumbs-item">{{ group.name }}</div>
                </li>
              </ul>
            </div>
          </v-card-text>
          <v-card flat>
            <v-row>
              <v-col cols="1"></v-col>
              <v-col cols="10">
                <v-card-title class="font-weight-bold mt-3">
                  {{ group.name }}
                  <v-spacer></v-spacer>
                  <v-tooltip top>
                    <template v-slot:activator="{ on, attrs  }">
                      <v-btn 
                              text 
                              v-bind="attrs"
                              v-on="on"
                              @click="edit_dialog = true" 
                              fab>
                        <v-icon class="ma-5">mdi-pencil</v-icon>
                      </v-btn>
                    </template>
                    <span>編集</span>
                  </v-tooltip>
                  <v-tooltip top>
                    <template v-slot:activator="{ on, attrs  }">
                      <v-btn 
                              text 
                              v-bind="attrs"
                              v-on="on"
                              @click="delete_dialog = true" 
                      fab>
                      <v-icon class="ma-5">mdi-delete</v-icon>
                    </v-btn>
                  </template>
                  <span>削除</span>
                </v-tooltip>
                </v-card-title>
                <hr class="mt-n3" />
                <v-simple-table class="my-9">
                  <template v-slot:default>
                    <tbody>
                      <tr>
                        <th>ID：</th>
                        <td class="caption">{{ group.id }}</td>
                      </tr>
                      <tr>
                        <th>ユーザー：</th>
                        <td class="caption">{{ user }}</td>
                      </tr>
                      <tr>
                        <th>グループ名：</th>
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
                        <td>
                          <v-chip
                            v-if="group.group_category_id == 1"
                            color="red"
                            text-color="white"
                            small
                            >{{ category[0] }}</v-chip
                          >
                          <v-chip
                            v-if="group.group_category_id == 2"
                            color="pink"
                            text-color="white"
                            small
                            >{{ category[1] }}</v-chip
                          >
                          <v-chip
                            v-if="group.group_category_id == 3"
                            color="blue"
                            text-color="white"
                            small
                            >{{ category[2] }}</v-chip
                          >
                          <v-chip
                            v-if="group.group_category_id == 4"
                            color="green"
                            text-color="white"
                            small
                            >{{ category[3] }}</v-chip
                          >
                          <v-chip
                            v-if="group.group_category_id == 5"
                            color="orange"
                            text-color="white"
                            small
                            >{{ category[4] }}</v-chip
                          >
                          <v-chip
                            v-if="group.group_category_id == 6"
                            color="blue-gray"
                            text-color="white"
                            small
                            >{{ category[5] }}</v-chip
                          >
                        </td>
                      </tr>
                      <tr>
                        <th>開催年：</th>
                        <td class="caption">{{ years[group.fes_year_id] }}</td>
                      </tr>
                      <tr>
                        <th>登録日時：</th>
                        <td class="caption">
                          {{ group.created_at | (format - date) }}
                        </td>
                      </tr>
                      <tr>
                        <th>編集日時：</th>
                        <td class="caption">
                          {{ group.updated_at | (format - date) }}
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

    <v-row>
      <v-col>
        <div class="card">
          <v-btn text color="white" to="/groups"
            ><v-icon color="#333333">mdi-arrow-left-bold</v-icon>
            <div class="back-button">参加団体一覧に戻る</div></v-btn
          >
        </div>
      </v-col>
    </v-row>

    <!-- modal window to edit -->
    <v-dialog v-model="edit_dialog" width="500">
      <v-card>
        <v-card-title class="headline blue-grey darken-3">
          <div style="color: white">
            <v-icon class="ma-5" dark>mdi-pencil</v-icon>編集
          </div><v-spacer></v-spacer>
          <v-btn text @click="edit_dialog = false" fab dark>
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text>
          <v-row>
            <v-col>
              <v-form ref="form">
                <v-text-field
                  label="グループ名"
                  v-model="groupName"
                  background-color="white"
                  outlined
                  filled
                  clearable
                ></v-text-field>
                <v-select
                  label="カテゴリ"
                  v-model="groupCategoryId"
                  :items="groupCategories"
                  :rules="[rules.required]"
                  :menu-props="{
                    top: true,
                    offsetY: true,
                  }"
                  item-text="name"
                  item-value="id"
                  outlined
                ></v-select>
                <v-text-field
                  label="企画名"
                  background-color="white"
                  outlined
                  v-model="groupProjectName"
                  filled
                  clearable
                ></v-text-field>
                <v-text-field
                  label="企画内容"
                  background-color="white"
                  outlined
                  v-model="groupActivity"
                  filled
                  clearable
                ></v-text-field>
              </v-form>
            </v-col>
          </v-row>
        </v-card-text>
        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="#78909C" dark @click="edit"> 編集する </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- 削除ダイアログ -->
    <v-dialog
      v-model="delete_dialog"
      width="500"
      >
      <v-card>
        <v-card-title class="headline blue-grey darken-3">
          <div style="color:white">削除</div>
        </v-card-title>

      <v-card-title>
        削除してよろしいですか？
      </v-card-title>

      <v-divider></v-divider>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          flat
          color="red"
          dark
          @click="delete_yes"
          >
          はい
        </v-btn>
        <v-btn
          flat
          color="blue"
          dark
          @click="delete_dialog = false"
          >
          いいえ
        </v-btn>
      </v-card-actions>
      </v-card>
    </v-dialog> 

    <!-- 編集成功SnackBar -->
    <v-snackbar
      v-model="success_snackbar"
      color="blue-grey"
      top
      elevation="24"
    >
      編集しました

      <template v-slot:action="{ attrs }">
        <v-btn
          color="white"
          text
          v-bind="attrs"
          @click="snackbar = false"
        >
        <v-icon>mdi-close</v-icon>
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      group: [],
      user_id: [],
      user: [],
      group_category_id: [],
      fes_year_id: [],
      group_categories: [],
      category: [],
      fes_years: [],
      years: [],
      expand: false,
      dialog: false,
      groupName: [],
      groupProjectName: [],
      groupCategoryId: [],
      groupActivity: [],
      edit_dialog: false,
      delete_dialog: false,
      success_snackbar: false,
      delete_snackbar: false,
      groupCategories: [
        { id: 1, name: "模擬店(食品販売)" },
        { id: 2, name: "模擬店(物品販売)" },
        { id: 3, name: "ステージ企画" },
        { id: 4, name: "展示・体験" },
        { id: 5, name: "研究室公開" },
        { id: 6, name: "その他" },
      ],
      rules: {
        required: (value) => !!value || "入力してください",
      },
    };
  },
  methods: {
    edit: function () {
      const edit_url =
        "/groups/" +
        this.group.id +
        "?" +
        "name=" +
        this.groupName +
        "&project_name=" +
        this.groupProjectName +
        "&group_category_id=" +
        this.groupCategoryId +
        "&activity=" +
        this.groupActivity;
      this.$axios
        .put(edit_url, {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          this.group = response.data;
          this.edit_dialog = false;
        });
    },
    delete_yes: function() {
      this.$router.push('/groups')
    }
  },
  mounted() {
    const url = "/groups/" + this.$route.params.id;
    this.$axios
      .get(url, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        this.group = response.data;
        this.groupName = response.data.name;
        this.groupProjectName = response.data.project_name;
        this.groupCategoryId = response.data.group_category_id;
        this.groupActivity = response.data.activity;
        this.user_id = response.data.user_id;
        this.group_category_id = response.data.group_category_id;
        this.fes_year_id = response.data.fes_year_id;
      });

    const user_url = "api/v1/users/show_user_detail/" + this.$route.params.id;
    this.$axios
      .get(user_url, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        console.log(response);
        this.user = response.data.user.name;
      });

    const category_url = "group_categories" + this.group_category_id;
    this.$axios
      .get(category_url, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        console.log(response);
        this.group_categories = response.data;
        for (let i = 0; i < this.group_categories.length; i++) {
          this.category.push(this.group_categories[i]["name"]);
        }
      });

    const year_url = "fes_years" + this.fes_year_id;
    this.$axios
      .get(year_url, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        console.log(response);
        this.fes_years = response.data;
        for (let i = 0; i < this.fes_years.length; i++) {
          this.years.push(this.fes_years[i]["year_num"]);
        }
      });
  },
};
</script>

<style>
.card {
  padding-left: 1%;
  padding-right: 5%;
}
</style>
