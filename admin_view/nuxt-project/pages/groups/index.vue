<template>
  <v-row>
    <v-col>
      <v-card flat class="mx-15">
        <v-row>
          <v-col cols="1"></v-col>
          <v-col cols="10">
            <v-card-title class="font-weight-bold mt-3">
              <v-icon class="mr-5">mdi-account-group</v-icon>参加団体申請一覧
              <v-spacer></v-spacer>
              <v-tooltip top>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    class="mx-2"
                    fab
                    text
                    v-bind="attrs"
                    v-on="on"
                    @click="open_add_dialog"
                  >
                    <v-icon dark>mdi-plus-circle-outline</v-icon>
                  </v-btn>
                </template>
                <span>参加団体の追加</span>
              </v-tooltip>
              <v-tooltip top>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    class="mx-2"
                    fab
                    text
                    v-bind="attrs"
                    v-on="on"
                    @click="reload"
                  >
                    <v-icon dark>mdi-reload</v-icon>
                  </v-btn>
                </template>
                <span>更新する</span>
              </v-tooltip>
            </v-card-title>
            <v-dialog v-model="dialog" max-width="500">
              <v-card>
                <v-card-title class="headline blue-grey darken-3">
                  <div style="color: white">
                    <v-icon class="ma-5" dark>mdi-account-group</v-icon
                    >参加団体の追加
                  </div>
                  <v-spacer></v-spacer>
                  <v-btn text @click="dialog = false" fab dark>
                    <v-icon>mdi-close</v-icon>
                  </v-btn>
                </v-card-title>

                <v-card-text>
                  <v-row>
                    <v-col>
                      <v-form ref="form">
                        <v-text-field
                          class="body-1"
                          label="団体名"
                          v-model="groupName"
                          background-color="white"
                          outlined
                          clearable
                        >
                        </v-text-field>
                        <v-select
                          label="カテゴリ"
                          v-model="groupCategoryId"
                          :items="groupCategories"
                          item-text="name"
                          item-value="id"
                          outlined
                        ></v-select>
                        <v-text-field
                          class="body-1"
                          label="企画名"
                          v-model="projectName"
                          background-color="white"
                          outlined
                          clearable
                        >
                        </v-text-field>
                        <v-textarea
                          label="活動内容"
                          v-model="activity"
                          @keydown="adjustHeight"
                          background-color="white"
                          outlined
                          clearable
                        >
                        </v-textarea>
                        <v-select
                          label="開催年"
                          v-model="fesYearId"
                          :items="year_list"
                          item-text="year_num"
                          item-value="id"
                          outlined
                        ></v-select>
                      </v-form>
                    </v-col>
                  </v-row>
                </v-card-text>

                <v-divider></v-divider>

                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn
                    depressed
                    dark
                    color="btn"
                    @click="register()"
                    >登録 ​
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
            <hr class="mt-n3" />
            <template>
              <div class="text-center" v-if="groups.length === 0">
                <br /><br />
                <v-progress-circular
                  indeterminate
                  color="#009688"
                ></v-progress-circular>
                <br /><br />
              </div>
              <div v-else>
                <v-data-table
                  :headers="headers"
                  :items="groups"
                  class="elevation-0 my-9"
                  @click:row="
                    (data) => $router.push({ path: `/groups/${data.group.id}` })
                  "
                >
                  <template v-slot:item.group.group_category_id="{ item }">
                    <v-chip
                      v-if="item.group.group_category_id == 1"
                      color="red"
                      text-color="white"
                      small
                      >{{ category[0] }}</v-chip
                    >
                    <v-chip
                      v-if="item.group.group_category_id == 2"
                      color="pink"
                      text-color="white"
                      small
                      >{{ category[1] }}</v-chip
                    >
                    <v-chip
                      v-if="item.group.group_category_id == 3"
                      color="blue"
                      text-color="white"
                      small
                      >{{ category[2] }}</v-chip
                    >
                    <v-chip
                      v-if="item.group.group_category_id == 4"
                      color="green"
                      text-color="white"
                      small
                      >{{ category[3] }}</v-chip
                    >
                    <v-chip
                      v-if="item.group.group_category_id == 5"
                      color="orange"
                      text-color="white"
                      small
                      >{{ category[4] }}</v-chip
                    >
                    <v-chip
                      v-if="item.group.group_category_id == 6"
                      color="blue-gray"
                      text-color="white"
                      small
                      >{{ category[5] }}</v-chip
                    >
                  </template>
                  <template v-slot:item.group.created_at="{ item }">
                    {{ item.group.created_at | format-date }}
                  </template>
                  <template v-slot:item.group.updated_at="{ item }">
                    {{ item.group.updated_at | format-date }}
                  </template>
                </v-data-table>
              </div>
            </template>
          </v-col>
          <v-col cols="1"></v-col>
        </v-row>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
export default {
  data() {
    return {
      groups: [],
      group_categories: [],
      category: [],
      fes_years: [],
      years: [],
      groupName: [],
      projectName: [],
      activity: [],
      groupCategoryId: [],
      fesYearId: [],
      year_list: [],
      user: [],
      dialog: false,
      groupCategories: [
        { id: 1, name: "模擬店(食品販売)" },
        { id: 2, name: "模擬店(物品販売)" },
        { id: 3, name: "ステージ企画" },
        { id: 4, name: "展示・体験" },
        { id: 5, name: "研究室公開" },
        { id: 6, name: "その他" },
      ],
      headers: [
        { text: "ID", value: "group.id" },
        { text: "グループ名", value: "group.name" },
        { text: "企画名", value: "group.project_name" },
        { text: "グループカテゴリ", value: "group.group_category_id" },
        { text: "開催年", value: "fes_year" },
        { text: "日時", value: "group.created_at" },
        { text: "編集日時", value: "group.updated_at" },
      ],
    };
  },
  mounted() {
    this.$axios
      .get("/api/v1/get_groups", {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        this.groups = response.data;
      });

    this.$axios
      .get("/group_categories", {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        this.group_categories = response.data;
        for (let i = 0; i < this.group_categories.length; i++) {
          this.category.push(this.group_categories[i]["name"]);
        }
      });

    this.$axios
      .get("/fes_years", {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        this.fes_years = response.data;
        for (let i = 0; i < this.fes_years.length; i++) {
          this.years.push(this.fes_years[i]["year_num"]);
        }
      });
  },
  methods: {
    open_add_dialog: function (){
      const url = "/api/v1/current_user/show";
      this.$axios
        .get(url, {
          headers: {
            "Content-Type": "application/json",
            "access-token": localStorage.getItem("access-token"),
            client: localStorage.getItem("client"),
            uid: localStorage.getItem("uid"),
          },
        })
        .then(
          (response) => {
            this.user = response.data.data;
          },
          (error) => {
            console.error(error);
            return error;
          }
        );
    this.$axios
      .get("/fes_years", {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        this.year_list = response.data;
      });
    this.dialog = true
    },
    reload: function () {
      this.$axios
        .get("/api/v1/get_groups", {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          this.groups = response.data;
        });
    },
    adjustHeight() {
      const textarea = this.$refs.activity;
      const resetHeight = new Promise(function (resolve) {
        resolve((textarea.style.height = "auto"));
      });
      resetHeight.then(function () {
        textarea.style.height = textarea.scrollHeight + "px";
      });
    },
    register: function () {
      this.$axios.defaults.headers.common["Content-Type"] = "application/json";
      var params = new URLSearchParams();
      params.append("user_id", this.user.id);
      params.append("name", this.groupName);
      params.append("project_name", this.projectName);
      params.append("activity", this.activity);
      params.append("group_category_id", this.groupCategoryId);
      params.append("fes_year_id", this.fesYearId);
      this.$axios.post("/groups", params).then((response) => {
        console.log(response);
        this.dialog = false;
        this.reload();
        this.groupName = "";
        this.projectName = "";
        this.activity = "";
        this.groupCategoryId = "";
        this.fesYearId = "";
      });
    },
  },
};
</script>
